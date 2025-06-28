import Router from 'express';
import { AuthenticatedRequest, authenticateToken } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { prisma } from '../lib/prisma';

const router = Router();

router.post('/book', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const userId = (req as AuthenticatedRequest).user.id;
        const { nurseId, diseases, scheduledDate } = req.body;
        console.log('Booking request received:', { userId, nurseId, diseases, scheduledDate });
        if (!nurseId || !diseases || !scheduledDate) {
            return res.status(400).json({
                success: false,
                message: "nurseId, diseases, and scheduledDate are required"
            });
        }

        await prisma.booking.create({
            data: {
                user : {
                    connect: { id: userId },
                },
                nurse : {
                    connect: { id: nurseId },
                },
                disease: diseases || '',
                scheduledDate: new Date(scheduledDate),
            },
        });

        return res.status(201).json({
            success: true,
        });

    } catch (error) {
        console.error('Error booking appointment:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}));

router.get('/get-bookings', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const userId = (req as AuthenticatedRequest).user.id;

        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
                nurse: true,
            },
        });

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No bookings found"
            });
        }

        return res.status(200).json({
            success: true,
            data: bookings,
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}));

export default router;