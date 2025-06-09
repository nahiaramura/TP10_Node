import express from "express"; // hacer npm i express
import cors from "cors";       // hacer npm i cors
import config from './configs/db-config.js'; // archivo con tus datos de conexión
import pkg from 'pg';

const { Client } = pkg;
const app = express();
const port = 3000;

// Middlewares
app.use(cors());         
app.use(express.json()); 

// GET todos los alumnos
app.get('/api/alumnos/', async (req, res) => {
    const client = new Client(config);
    await client.connect();

    try {
        const result = await client.query('SELECT * FROM alumnos');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener alumnos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        await client.end();
    }
});

// GET alumno por id
app.get('/api/alumnos/:id', async (req, res) => {
    const { id } = req.params;
    const client = new Client(config);
    await client.connect();

    try {
        const result = await client.query('SELECT * FROM alumnos WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener alumno:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        await client.end();
    }
});

// POST nuevo alumno
app.post('/api/alumnos/', async (req, res) => {
    const { nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = req.body;
    const client = new Client(config);
    await client.connect();

    try {
        const result = await client.query(
            `INSERT INTO alumnos (nombre, apellido, id_curso, fecha_nacimiento, hace_deportes) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [nombre, apellido, id_curso, fecha_nacimiento, hace_deportes]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al insertar alumno:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        await client.end();
    }
});

// PUT (actualizar) alumno
app.put('/api/alumnos/', async (req, res) => {
    const { id, nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = req.body;
    const client = new Client(config);
    await client.connect();

    try {
        const result = await client.query(
            `UPDATE alumnos 
             SET nombre = $1, apellido = $2, id_curso = $3, fecha_nacimiento = $4, hace_deportes = $5 
             WHERE id = $6 RETURNING *`,
            [nombre, apellido, id_curso, fecha_nacimiento, hace_deportes, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar alumno:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        await client.end();
    }
});

// DELETE alumno por id
app.delete('/api/alumnos/:id', async (req, res) => {
    const { id } = req.params;
    const client = new Client(config);
    await client.connect();

    try {
        const result = await client.query('DELETE FROM alumnos WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        res.json({ mensaje: 'Alumno eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar alumno:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        await client.end();
    }
});

// Inicio del servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
