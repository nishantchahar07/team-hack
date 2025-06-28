import Router, { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { prisma } from '../lib/prisma';
import { parseExtractedData } from '../utils/helper';

const router = Router();

router.post('/create', asyncHandler(async (req: Request, res: Response) => {
    try {
        const { session_id, filename, extracted_data, timestamp } = req.body;

        if (!session_id || !filename || !extracted_data || !timestamp) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: session_id, filename, extracted_data, timestamp"
            });
        }

        const structuredData = parseExtractedData(extracted_data);

        const reportData = {
            session_id,
            filename,
            timestamp,
            raw_extracted_data: extracted_data,
            structured_data: structuredData
        };

        console.log('Structured Report Data:', JSON.stringify(reportData, null, 2));

        const newlyCreatedRecord = await prisma.report.create({
            data: {
                structuredData: reportData,
            }
        });

        return res.status(201).json({
            success: true,
            message: "Report created successfully",
            data: newlyCreatedRecord
        });
    } catch (error) {
        console.error('Error creating report:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}));

router.get("/", asyncHandler(async (req: Request, res: Response) => {
    try {
        const reports = await prisma.report.findMany({
            orderBy:{
                createdAt: 'desc'
            }
        });
        return res.status(200).json({
            success: true,
            data: reports
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
));

export default router;