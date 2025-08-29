import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import alumnoRouter from './controllers/alumno-controller.js'; 
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use('/static', express.static(uploadsPath));

app.use('/api/alumnos', alumnoRouter);

app.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'La imagen supera el máximo de 5 MB.' });
    }
    return res.status(400).json({ error: `Error de carga: ${err.code}` });
  }
  if (err?.message?.toLowerCase?.().includes('solo se permiten archivos de imagen')) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
