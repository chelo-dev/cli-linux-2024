import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    await registerUser(username, password, email);
    res.status(201).send({ error: false, message: 'User registered successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ error: true, message: error.message });
    } else {
      res.status(500).send({ error: true, message: "An unexpected error occurred." });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const access_token = await loginUser(username, password);
    res.status(200).send({ error: false, access_token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).send({ error: true, message: error.message });
    } else {
      res.status(401).send({ error: true, message: "An unexpected error occurred." });
    }
  }
};
