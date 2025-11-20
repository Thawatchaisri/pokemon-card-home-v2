import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import router from './routes';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
// Explicitly cast express.static to any if types are still mismatched, but standardizing usage should work.
// The previous error was likely due to mismatched 'express' types between this file and router handlers.
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', router);

// Health Check
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('CardCollector Pro API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});