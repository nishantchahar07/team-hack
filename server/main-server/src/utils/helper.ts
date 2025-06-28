import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv'

dotenv.config();

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const generateUniqueId = (): string => {
    return crypto.randomUUID();
};

export const comparePasswords = async (
    plainText: string,
    hashedPassword: string
): Promise<boolean> => {
    return await bcrypt.compare(plainText, hashedPassword);
};

export const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const formatDate = (date: Date | string, format = 'yyyy-MM-dd'): string => {
    const d = new Date(date);
    return format
        .replace('yyyy', d.getFullYear().toString())
        .replace('MM', (d.getMonth() + 1).toString().padStart(2, '0'))
        .replace('dd', d.getDate().toString().padStart(2, '0'));
};

export const generateRandomHex = (bytes = 32): string => {
    return crypto.randomBytes(bytes).toString('hex');
};

// Helper function to calculate distance between two coordinates 
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export function parseExtractedData(extractedText: string) {
    const lines = extractedText.split('\n').map(line => line.trim()).filter(line => line);

    const result = {
        patient: {
            name: '',
            age: null as number | null,
            gender: ''
        },
        tests: [] as any[],
        summary: ''
    };

    let currentTest: any = {};

    for (const line of lines) {
        if (line.startsWith('- Patient Name:')) {
            result.patient.name = line.replace('- Patient Name:', '').trim();
        } else if (line.startsWith('- Age:')) {
            const ageStr = line.replace('- Age:', '').trim();
            result.patient.age = parseInt(ageStr) || null;
        } else if (line.startsWith('- Gender:')) {
            result.patient.gender = line.replace('- Gender:', '').trim();
        }
        else if (line.startsWith('- Test:')) {
            if (currentTest.name) {
                result.tests.push({ ...currentTest });
            }
            currentTest = {
                name: line.replace('- Test:', '').trim(),
                value: null,
                referenceRange: '',
                interpretation: '',
                riskCategory: ''
            };
        } else if (line.startsWith('  - Value:')) {
            const value = line.replace('  - Value:', '').trim();
            currentTest.value = isNaN(parseFloat(value)) ? value : parseFloat(value);
        } else if (line.startsWith('  - Reference Range:')) {
            currentTest.referenceRange = line.replace('  - Reference Range:', '').trim();
        } else if (line.startsWith('  - Interpretation:')) {
            currentTest.interpretation = line.replace('  - Interpretation:', '').trim();
        } else if (line.startsWith('  - Risk Category:')) {
            currentTest.riskCategory = line.replace('  - Risk Category:', '').trim();
        }
        else if (line.startsWith('**Summary:**')) {
            result.summary = line.replace('**Summary:**', '').trim();
        } else if (result.summary && line && !line.startsWith('-') && !line.startsWith('**')) {
            result.summary += ' ' + line;
        }
    }

    if (currentTest.name) {
        result.tests.push(currentTest);
    }

    return result;
}