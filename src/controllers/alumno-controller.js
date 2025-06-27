import express from 'express';
import * as alumnoService from '../services/alumno-service.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const alumnos = await alumnoService.obtenerTodos();
        res.json(alumnos);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const alumno = await alumnoService.obtenerPorId(req.params.id);
        if (!alumno) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        res.json(alumno);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const nuevoAlumno = await alumnoService.crearAlumno(req.body);
        res.status(201).json(nuevoAlumno);
    } catch (error) {
        next(error);
    }
});

router.put('/', async (req, res, next) => {
    try {
        const alumnoActualizado = await alumnoService.actualizarAlumno(req.body);
        if (!alumnoActualizado) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        res.json(alumnoActualizado);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const eliminado = await alumnoService.eliminarAlumno(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        res.json({ mensaje: 'Alumno eliminado correctamente' });
    } catch (error) {
        next(error);
    }
});

export default router;
