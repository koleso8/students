import createHttpError from 'http-errors';
import { ROLES } from '../constants/index.js';
import { StudentsCollection } from '../db/models/student.js';

export const checkRoles =
  (...roles) =>
  async (req, res, next) => {
    const { user } = req;

    if (!user) {
      next(createHttpError(401, 'User not found'));
      return;
    }

    const { role } = user;
    if (roles.includes(ROLES.TEACHER) && role === ROLES.TEACHER) {
      next();
      return;
    }
    if (roles.includes(ROLES.PARENT) && role === ROLES.PARENT) {
      const { studentsId } = req.params;

      if (!studentsId) {
        next(createHttpError(403, 'student not found'));
        return;
      }

      const student = await StudentsCollection.findOne({
        _id: studentsId,
        parentId: user._id,
      });

      if (student) {
        next();
        return;
      }
    }
    next(createHttpError(403, 'role error'));
  };
