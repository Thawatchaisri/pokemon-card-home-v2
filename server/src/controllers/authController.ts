import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    // Check existing
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.user.create({
      data: {
        email,
        username: username || email.split('@')[0],
        password: hashedPassword,
        verificationCode: code,
        role: 'user' // defaulting role to user
      }
    });

    // In real app, send email here
    console.log(`[EMAIL SIMULATION] Code for ${email}: ${code}`);

    res.json({ message: 'Registration successful. Please verify email.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const verifyEmail = async (req: express.Request, res: express.Response) => {
  try {
    const { email, code } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.verificationCode !== code) return res.status(400).json({ error: 'Invalid code' });

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { isVerified: true, verificationCode: null }
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role.toLowerCase()
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { emailOrUsername, password } = req.body;
    
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ]
      }
    });

    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    if (!user.isVerified) return res.status(403).json({ error: 'Email not verified' });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role.toLowerCase()
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProfile = async (req: express.Request, res: express.Response) => {
  try {
    // Cast to any to access user which is added by middleware
    const userId = (req as any).user?.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role.toLowerCase()
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};