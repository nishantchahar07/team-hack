import Router, { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { prisma } from '../lib/prisma';
import  Gender  from '@prisma/client';

const router = Router();

router.post('/create', asyncHandler(async (req: Request, res: Response) => {
    try {
        const {
            name,
            specialization,
            experienceYears,
            language,
            gender,
            phone,
            email,
            available = true,
            location
        } = req.body;

        if (!name || !specialization || !experienceYears || !language || !gender || !phone || !email) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided: name, specialization, experienceYears, language, gender, phone, email"
            });
        }

        if (!Object.values(Gender).includes(gender)) {
            return res.status(400).json({
                success: false,
                message: "Invalid gender. Must be one of: MALE, FEMALE, OTHER"
            });
        }

        const existingNurse = await prisma.nurse.findFirst({
            where: {
                OR: [
                    { email: email },
                    { phone: phone }
                ]
            }
        });

        if (existingNurse) {
            return res.status(400).json({
                success: false,
                message: "Nurse with this email or phone number already exists"
            });
        }

        let locationId = null;

        const { lat, lng, address } = location;

        if (!lat || !lng || !address) {
            return res.status(400).json({
                success: false,
                message: "Location must include lat, lng, and address"
            });
        }

        const createdLocation = await prisma.location.create({
            data: {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                address: address
            }
        });

        locationId = createdLocation.id;

        const newNurse = await prisma.nurse.create({
            data: {
                name,
                specialization,
                experienceYears: parseInt(experienceYears),
                language,
                gender,
                phone,
                email,
                available,
                locationId
            },
            include: {
                Location: true
            }
        });

        return res.status(201).json({
            success: true,
            message: "Nurse created successfully",
            data: newNurse
        });

    } catch (error) {
        console.error('Error creating nurse:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}));

router.get('/list', asyncHandler(async (req: Request, res: Response) => {
    try {
        const nurses = await prisma.nurse.findMany({
            include: {
                Location: true
            }
        });
        return res.status(200).json({
            success: true,
            data: nurses
        });
    } catch (error) {
        console.error('Error fetching nurses:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}));

router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const nurse = await prisma.nurse.findUnique({
            where: { id },
            include: {
                Location: true
            }
        });

        if (!nurse) {
            return res.status(404).json({
                success: false,
                message: "Nurse not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: nurse
        });
    } catch (error) {
        console.error('Error fetching nurse:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}));

export default router