import express from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export interface AuthRequest extends express.Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authReq = req as AuthRequest;
  // Check for admin role (assuming 'admin' based on token creation, changed from 'ADMIN' to match expected token payload)
  if (!authReq.user || authReq.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};