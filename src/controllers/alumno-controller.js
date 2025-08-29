// src/routes/alumnos.js
import express from 'express';
import * as alumnoService from '../services/alumno-service.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

/* ============ Multer (como en el repo del profe) ============ */
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname || '') || '.jpg';
    cb(null, `alumno_${req.params.id}_${Date.now()}${ext.toLowerCase()}`);
  }
});

function imageOnly(_req, file, cb) {
  if (!file.mimetype?.startsWith('image/')) {
    return cb(new Error('Solo se permiten archivos de imagen.'), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: imageOnly
});

/* =========================
   CRUD
   ========================= */
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

/* =========================
   Subir foto (campo "image")
   - Guarda SOLO el nombre de archivo en DB
   - Responde también con /static/{filename}
   ========================= */
router.post('/:id/photo', upload.single('image'), async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    // Validación: llegó archivo
    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'Debe enviar una imagen en el campo "image" (multipart/form-data).' });
    }

    // Verificar que exista el alumno
    const alumno = await alumnoService.obtenerPorId(id);
    if (!alumno) {
      // si Multer ya guardó el archivo, lo borramos
      try { fs.unlinkSync(path.join(uploadsDir, req.file.filename)); } catch {}
      return res.status(404).json({ error: `Alumno no encontrado (id:${id})` });
    }

    // Actualizar solo filename en DB
    const filename = req.file.filename;
    const updated = await alumnoService.actualizarImagen(id, filename);

    const url = `/static/${filename}`;
    res.status(201).json({ id, filename, url, alumno: updated });
  } catch (error) {
    // si hubo error y hay archivo, intentar limpiarlo para no dejar basura
    if (req?.file?.filename) {
      try { fs.unlinkSync(path.join(uploadsDir, req.file.filename)); } catch {}
    }
    next(error);
  }
});

export default router;
