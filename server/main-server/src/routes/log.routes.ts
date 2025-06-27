import Router from 'express';
import { AuthenticatedRequest, authenticateToken } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { prisma } from '../lib/prisma';
import { ModelTrainingData } from '@prisma/client';

const router = Router();

router.post('/create', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        const { nurseId, disease, durationMonths, symptoms, painLevel, priorDiagnosis, comorbidity, preferredLanguage }: ModelTrainingData = req.body;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!Array.isArray(symptoms)) {
            return res.status(400).json({ error: "Symptoms must be an array" });
        }

        await prisma.modelTrainingData.create({
            data: {
                user: {
                    connect: { id: userId }
                },
                nurseId,
                disease,
                durationMonths,
                symptoms,
                painLevel,
                priorDiagnosis,
                comorbidity,
                preferredLanguage
            }
        });

        res.status(201).json({ success: true, message: "Log created successfully" });

    } catch (error) {
        console.error("Error creating log:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));

router.get('/get', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const userId = (req as AuthenticatedRequest).user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const logs = await prisma.modelTrainingData.findMany({
            where: { userId }
        });

        res.status(200).json({ success: true, data: logs });

    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));

export default router;