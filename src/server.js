import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import alumnoRouter from './controllers/alumno-controller.js';
import errorHandler from './middlewares/error-handler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/alumnos', alumnoRouter);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
