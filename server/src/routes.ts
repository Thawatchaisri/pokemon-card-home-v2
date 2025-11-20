import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import * as auth from './controllers/authController';
import * as card from './controllers/cardController';
import { authenticate, requireAdmin } from './middleware/authMiddleware';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// --- Auth ---
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.post('/auth/verify', auth.verifyEmail);
router.get('/auth/me', authenticate, auth.getProfile);
router.post('/auth/resend', async (req: express.Request, res: express.Response) => {
    // Logic to resend code
    res.json({ success: true });
});

// --- Cards Public ---
router.get('/cards', card.getCards);
router.get('/cards/:id', card.getCardById);
router.get('/cards/:id/history', card.getPriceHistory);

// --- Admin Cards ---
router.post('/cards', authenticate, requireAdmin, card.createCard);
router.put('/cards/:id', authenticate, requireAdmin, card.updateCard);
router.delete('/cards/:id', authenticate, requireAdmin, card.deleteCard);

// --- Uploads ---
router.post('/upload', authenticate, requireAdmin, upload.single('file'), (req: express.Request, res: express.Response) => {
    if (!(req as any).file) return res.status(400).json({ error: 'No file uploaded' });
    const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${(req as any).file.filename}`;
    res.json({ url: fullUrl });
});

// --- QR Management ---
router.get('/system/qr', async (req: express.Request, res: express.Response) => {
    const setting = await prisma.systemSetting.findUnique({ where: { key: 'line_qr' } });
    res.json({ url: setting?.value || '' });
});

router.post('/system/qr', authenticate, requireAdmin, upload.single('file'), async (req: express.Request, res: express.Response) => {
    if (!(req as any).file) return res.status(400).json({ error: 'No file' });
    const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${(req as any).file.filename}`;
    
    await prisma.systemSetting.upsert({
        where: { key: 'line_qr' },
        update: { value: fullUrl },
        create: { key: 'line_qr', value: fullUrl }
    });
    res.json({ url: fullUrl });
});

// --- News ---
router.get('/news', async (req: express.Request, res: express.Response) => {
    // Mock for now or implement simple table
    res.json([
        { id: '1', title: 'Grand Opening', content: 'Welcome to CardCollector Pro!', date: new Date() }
    ]);
});

export default router;