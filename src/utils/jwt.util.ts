import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET as string;

export const generateToken = (payload: object, expiry: string) =>
  jwt.sign(payload, secret, { expiresIn: expiry });

export const verifyToken = (token: string) =>
  jwt.verify(token, secret);
