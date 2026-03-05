import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Serve uploaded files as static assets
app.use('/uploads', express.static(UPLOADS_DIR));

// Multer config
const storage = multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
        filename: (_req, file, cb) => {
                const ext = path.extname(file.originalname);
                cb(null, `${Date.now()}${ext}`);
        }
});
const upload = multer({
        storage,
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
                if (file.mimetype.startsWith('image/')) cb(null, true);
                else cb(new Error('Only image files are allowed'));
        }
});

const DB_FILE = path.join(__dirname, 'causes.json');

const getCauses = () => {
        if (!fs.existsSync(DB_FILE)) return [];
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data || '[]');
};

const saveCauses = (data) => {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'takweyat_admin';

const authenticate = (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader === `Bearer ${ADMIN_PASSWORD}`) {
                next();
        } else {
                res.status(401).json({ error: 'Unauthorized' });
        }
};

// Upload image endpoint
app.post('/api/upload', authenticate, upload.single('image'), (req, res) => {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        res.json({ url: `/uploads/${req.file.filename}` });
});

app.get('/api/causes', (req, res) => {
        res.json(getCauses());
});

app.post('/api/causes', authenticate, (req, res) => {
        const causes = getCauses();
        const newCause = { id: Date.now().toString(), ...req.body };
        causes.push(newCause);
        saveCauses(causes);
        res.status(201).json(newCause);
});

app.put('/api/causes/:id', authenticate, (req, res) => {
        const causes = getCauses();
        const index = causes.findIndex(c => c.id === req.params.id);
        if (index !== -1) {
                causes[index] = { ...causes[index], ...req.body };
                saveCauses(causes);
                res.json(causes[index]);
        } else {
                res.status(404).json({ error: 'Not found' });
        }
});

app.delete('/api/causes/:id', authenticate, (req, res) => {
        let causes = getCauses();
        causes = causes.filter(c => c.id !== req.params.id);
        saveCauses(causes);
        res.json({ success: true });
});

// Serve built React frontend in production
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        // Express v5 requires named wildcard — 'app.get("*")' crashes on startup
        app.get('/{*path}', (req, res) => {
                res.sendFile(path.join(distPath, 'index.html'));
        });
}

app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
});
