import Router, { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { prisma } from '../lib/prisma';
import Gender from '@prisma/client';
import { AuthenticatedRequest, authenticateToken } from '../middlewares/auth.middleware';

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

router.post('/get-many', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids)) {
            return res.status(400).json({
                success: false,
                message: "ids must be an array"
            });
        }

        const nurses = await prisma.nurse.findMany({
            where: {
                id: {
                    in: ids
                }
            },
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

router.post("/reschedule", asyncHandler(authenticateToken), asyncHandler(async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        const { scheduleDate, bookingId } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!scheduleDate || !bookingId) {
            return res.status(400).json({ message: "scheduleDate and bookingId are required" });
        }

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { nurse: true, user: true },
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.userId !== userId && booking.nurseId !== userId) {
            return res.status(403).json({ message: "You are not authorized to reschedule this booking" });
        }

        const newDate = new Date(scheduleDate);
        if (isNaN(newDate.getTime())) {
            return res.status(400).json({ message: "Invalid scheduleDate" });
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: { scheduledDate: newDate },
        });

        return res.status(200).json({ message: "Booking rescheduled successfully", data: updatedBooking });
    } catch (error) {
        console.error('Error rescheduling booking:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));

router.get("/cancel", asyncHandler(authenticateToken), asyncHandler(async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        const { bookingId } = req.query;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!bookingId || typeof bookingId !== "string") {
            return res.status(400).json({ message: "bookingId is required as a query parameter" });
        }

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (booking.userId !== userId && booking.nurseId !== userId) {
            return res.status(403).json({ message: "You are not authorized to cancel this booking" });
        }

        const cancelledBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'CANCELLED' },
        });

        return res.status(200).json({
            message: "Booking cancelled successfully",
            data: cancelledBooking,
        });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));

export default router