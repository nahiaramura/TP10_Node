import * as alumnoRepo from '../repositories/alumno-repository.js';

export const obtenerTodos = async () => {
    return await alumnoRepo.getAllAlumnos();
};

export const obtenerPorId = async (id) => {
    return await alumnoRepo.getAlumnoById(id);
};

export const crearAlumno = async (alumno) => {
    return await alumnoRepo.createAlumno(alumno);
};

export const actualizarAlumno = async (alumno) => {
    return await alumnoRepo.updateAlumno(alumno);
};

export const eliminarAlumno = async (id) => {
    return await alumnoRepo.deleteAlumnoById(id);
};

export const actualizarImagen = async (id, filename) => {
    return await alumnoRepo.updateAlumnoImagen(id, filename);
  };
  