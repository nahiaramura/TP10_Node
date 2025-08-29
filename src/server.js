import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import alumnoRouter from './controllers/alumno-controller.js'; // OK si tu archivo se llama así
import errorHandler from './middlewares/error-handler.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// (opcional) si recibís JSON muy grandes, podés subir el límite:
// app.use(express.json({ limit: '2mb' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Alinear con el router: process.cwd()/uploads
const uploadsPath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Archivos estáticos
app.use('/static', express.static(uploadsPath));

// Rutas
app.use('/api/alumnos', alumnoRouter);

// Handler específico para errores de Multer (límite, tipo de archivo, etc.)
app.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'La imagen supera el máximo de 5 MB.' });
    }
    return res.status(400).json({ error: `Error de carga: ${err.code}` });
  }
  // Si lanzaste un Error normal en el fileFilter (tipo de archivo), también lo capturás acá:
  if (err?.message?.toLowerCase?.().includes('solo se permiten archivos de imagen')) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

// (Opcional) 404 para endpoints no definidos
// app.use((req, res) => res.status(404).json({ error: 'Recurso no encontrado' }));

// Middleware de errores general
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
