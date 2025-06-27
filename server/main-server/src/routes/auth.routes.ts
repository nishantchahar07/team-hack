import Router, { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateVerificationCode } from '../utils/helper';
import { sendVerificationEmail } from '../emails/verificationMail';

const router = Router();

router.post('/signup', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { email, password, name, phone } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: "Email, password, and name are required" });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser?.verified) {
            return res.status(400).json({ message: "User already exists! Please login" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verifyCode = generateVerificationCode();

        if (existingUser && !existingUser.verified) {
            await prisma.user.update({
                where: { email },
                data: {
                    password: hashedPassword,
                    verifyCode,
                    name,
                    phone
                }
            });
        } else {
            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    phone: phone || null,
                    verifyCode,
                    verified: false
                }
            });
        }

        const emailResult = await sendVerificationEmail(email, verifyCode, 'signup');
        if (!emailResult.success) {
            return res.status(500).json({ message: "Failed to send verification email" });
        }

        res.status(201).json({ message: "User registered successfully! Please check your email for verification." });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));

router.post('/verify', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: "Email and verification code are required" });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.verified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        if (user.verifyCode !== code) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        await prisma.user.update({
            where: { email },
            data: {
                verified: true,
                verifyCode: null
            }
        });

        return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Verification error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));

router.post('/signin', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });
        console.log();

        if (!user) {
            return res.status(401).json({ message: "User does not exist!!" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        const { ...userWithoutPassword } = user;

        return res.status(200).json({
            message: "Login successful",
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));

export default router;