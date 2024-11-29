import { uuidv4 } from '../utils/shared.util';
import { RowDataPacket } from 'mysql2';
import pool from '../config/db';

interface User extends RowDataPacket {
  id: number;
  uuid: string;
  username: string;
  password: string;
  email: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export const findUserByUsername = async (username: string): Promise<User | null> => {
  const [rows] = await pool.query<User[]>('SELECT * FROM users WHERE username = ? ', [username]);
  return rows.length ? rows[0] : null;
};

export const createUser = async (username: string, password: string, email: string): Promise<void> => {
  await pool.query(
    'INSERT INTO users (uuid, username, password, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', [
      uuidv4(),
      username,
      password,
      email,
      new Date(),
      new Date()
    ]
  );
};


