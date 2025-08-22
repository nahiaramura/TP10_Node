import express from 'express';
import * as alumnoService from '../services/alumno-service.js';
import multer from 'multer';
import path from 'path';


const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(process.cwd(), 'uploads'));
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname || '') || '.jpg';
      cb(null, `alumno_${req.params.id}_${Date.now()}${ext}`);
    }
  });
  const upload = multer({ storage });

  
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

router.post('/:id/photo', upload.single('image'), async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!req.file) {
        return res.status(400).json({ error: 'Debe enviar una imagen en el campo "image" (multipart/form-data).' });
      }
      const filename = req.file.filename;
      const updated = await alumnoService.actualizarImagen(id, filename);
      const url = `/static/${filename}`;
      res.status(201).json({ id, filename, url, alumno: updated });
    } catch (error) {
      next(error);
    }
  });
  
export default router;
