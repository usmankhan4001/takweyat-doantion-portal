import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'causes.json');

const getCauses = () => {
        if (!fs.existsSync(DB_FILE)) return [];
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data || '[]');
};

const saveCauses = (data) => {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

app.get('/api/causes', (req, res) => {
        res.json(getCauses());
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "takweyat_admin";

const authenticate = (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader === `Bearer ${ADMIN_PASSWORD}`) {
                next();
        } else {
                res.status(401).json({ error: "Unauthorized" });
        }
};

app.post('/api/causes', authenticate, (req, res) => {
        const causes = getCauses();
        const newCause = {
                id: Date.now().toString(),
                ...req.body
        };
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
                res.status(404).json({ error: "Not found" });
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
        // SPA fallback — serve index.html for all non-API routes
        app.get('*', (req, res) => {
                res.sendFile(path.join(distPath, 'index.html'));
        });
}

app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
});
