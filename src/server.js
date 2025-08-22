import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import alumnoRouter from './controllers/alumno-controller.js';
import errorHandler from './middlewares/error-handler.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/static', express.static(uploadsPath));


app.use('/api/alumnos', alumnoRouter);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
