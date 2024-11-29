import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).send({ error: true, message: 'Token required' });
    }
    try {
        const payload = verifyToken(token);
        (req as any).user = payload;
        next();
    } catch {
        res.status(401).send({ error: true, message: 'Invalid or expired token' });
    }
};
