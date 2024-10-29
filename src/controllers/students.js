import * as services from '../services/student.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getStudentsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);

  const { sortBy, sortOrder } = parseSortParams(req.query);

  const filter = parseFilterParams(req.query);

  const students = await services.getAllStudents({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
  res.status(200).json({ data: students });
};

export const getStudentByIdController = async (req, res, next) => {
  const { studentsId } = req.params;

  const student = await services.getStudentById(studentsId);

  if (!student) {
    throw createHttpError(404, 'Student not found');
  }
  res.json({
    status: 200,
    message: `Successfully found student with id ${studentsId} !`,
    data: student,
  });
};

export const createStudentController = async (req, res) => {
  const photo = req.file;
  let photoUrl;
  if (photo) {
    photoUrl = await saveFileToUploadDir(photo);
  }

  const student = await services.createStudent({
    ...req.body,
    photo: photoUrl,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a student !',
    data: student,
  });
};

export const deleteStudentsController = async (req, res, next) => {
  const { studentsId } = req.params;

  const student = await services.deleteStudent(studentsId);

  if (!student) {
    next(createHttpError(404, 'Student not found'));
    return;
  }
  res.status(204).send();
};

export const upsertStudentController = async (req, res, next) => {
  const { studentId } = req.params;

  const result = await services.updateStudent(studentId, req.body, {
    upsert: true,
  });

  if (!result) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Successfully upserted a student !',
    data: result.student,
  });
};

export const patchStudentController = async (req, res, next) => {
  const { studentId } = req.params;
  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await services.updateStudent(studentId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.json({
    status: 200,
    message: 'Successfully patced a student !',
    data: result.student,
  });
};
