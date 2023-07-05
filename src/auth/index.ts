import db from '../db/connection';
import { User } from '../types/api';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';


const ENV = process.env.NODE_ENV || "development"
const path = `${__dirname}/../../config/.env.${ENV}`
dotenv.config({ path });


export async function getUserWithPasswordByUsername(username: string): Promise<User | null> {
    try {
        const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        return rows[0] || null;
    } catch (error) {
        console.error('getUserWithPasswordByUsername:', error);
        throw error;
    }
}

export async function createToken(user: User) {
    try {
        return jwt.sign({ username: user.username }, process.env.SECRET as string);
    } catch (error) {
        console.error('createToken:', error);
        throw error;
    }
}

export async function verifyToken(token: string) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET as string);
        return decoded as { username: string };
    } catch (error) {
        console.error('verifyToken:', error);
        return null;
    }
}

export async function hashPassword(password: string) {
    try {
        return bcrypt.hash(password, 10);
    } catch (error) {
        console.error('hashPassword:', error);
        throw error;
    }
}

export async function verifyPassword(password: string, hash: string) {
    try {
        return bcrypt.compare(password, hash);
    } catch (error) {
        console.error('verifyPassword:', error);
        throw error;
    }
}

export async function isAuthorised(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(403).send({ msg: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        const decoded = await verifyToken(token);
        if (!decoded) {
            return res.status(403).send('Failed to authenticate token');
        }

        const user = await getUserWithPasswordByUsername(decoded.username);
        if (!user) {
            return res.status(403).send('User not found');
        }

        (req as any).user = user;
        next();
    } catch (error) {
        console.error('isAuthorised:', error);
        return res.status(500).send('Server error');
    }
}

export async function login(req: Request, res: Response) {
    const { username, password } = req.body;

    const user = await getUserWithPasswordByUsername(username);
    if (!user) {
        return res.status(401).send('Invalid credentials');
    }
    const passwordValid = await verifyPassword(password, user.password);
    if (!passwordValid) {
        return res.status(401).send('Invalid credentials');
    }

    const token = await createToken(user);
    res.send({ token });
};
export function userFromRequest(req: Request) {
    const { user }: {
        user: { username: string, name: string, avatar_url: string }
    } = req as any
    if (!user) throw new Error('Bad Request')
    return user
}