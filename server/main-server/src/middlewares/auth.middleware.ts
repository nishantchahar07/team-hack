import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { User } from '@prisma/client';

interface VerifiedToken extends JwtPayload {
  userId: string;
  email: string;
  iat: number,
  exp: number
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const header = req.headers['authorization'];
    const token = header?.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET!) as VerifiedToken;
    if (!verifiedToken) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const user = await prisma.user.findFirst({
      where: { id: verifiedToken.userId }
    });

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    req.user = user;
    next();

  } catch (error) {
    console.error('Error in authentication:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}