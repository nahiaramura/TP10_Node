import pkg from 'pg';
import config from '../configs/db-config.js';

const { Client } = pkg;

export const getAllAlumnos = async () => {
    const client = new Client(config);
    await client.connect();
    try {
        const result = await client.query('SELECT * FROM alumnos');
        return result.rows;
    } finally {
        await client.end();
    }
};

export const getAlumnoById = async (id) => {
    const client = new Client(config);
    await client.connect();
    try {
        const result = await client.query('SELECT * FROM alumnos WHERE id = $1', [id]);
        return result.rows[0];
    } finally {
        await client.end();
    }
};

export const createAlumno = async (alumno) => {
    const { nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = alumno;
    const client = new Client(config);
    await client.connect();
    try {
        const result = await client.query(
            `INSERT INTO alumnos (nombre, apellido, id_curso, fecha_nacimiento, hace_deportes) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [nombre, apellido, id_curso, fecha_nacimiento, hace_deportes]
        );
        return result.rows[0];
    } finally {
        await client.end();
    }
};

export const updateAlumno = async (alumno) => {
    const { id, nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = alumno;
    const client = new Client(config);
    await client.connect();
    try {
        const result = await client.query(
            `UPDATE alumnos 
             SET nombre = $1, apellido = $2, id_curso = $3, fecha_nacimiento = $4, hace_deportes = $5
             WHERE id = $6 RETURNING *`,
            [nombre, apellido, id_curso, fecha_nacimiento, hace_deportes, id]
        );
        return result.rows[0];
    } finally {
        await client.end();
    }
};

export const deleteAlumnoById = async (id) => {
    const client = new Client(config);
    await client.connect();
    try {
        const result = await client.query(
            'DELETE FROM alumnos WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    } finally {
        await client.end();
    }
};

export const updateAlumnoImagen = async (id, filename) => {
    const client = new Client(config);
    await client.connect();
    try {
      const result = await client.query(
        `UPDATE alumnos SET imagen = $2 WHERE id = $1 RETURNING *`,
        [id, filename]
      );
      return result.rows[0] || null;
    } finally {
      await client.end();
    }
  };
  