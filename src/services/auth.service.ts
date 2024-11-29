import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.util';
import { findUserByUsername, createUser } from '../models/user.model';

export const registerUser = async (username: string, password: string, email: string) => {
    const user = await findUserByUsername(username);
    if (user) {
        throw new Error('The username is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(username, hashedPassword, email);
};

export const loginUser = async (username: string, password: string) => {
    const user = await findUserByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
    }
    const token = generateToken({ id: user.id, limit: process.env.TOKEN_LIMIT }, process.env.TOKEN_EXPIRY!);
    return token;
};
