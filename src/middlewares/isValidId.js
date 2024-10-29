import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId = (req, res, next) => {
  const { studentsId } = req.params;
  if (!isValidObjectId(studentsId)) {
    throw createHttpError(400, 'Bad Request');
  }
  next();
};
