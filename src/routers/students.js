import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import * as controllers from '../controllers/students.js';
import * as validations from '../validation/students.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/index.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  checkRoles(ROLES.TEACHER),
  ctrlWrapper(controllers.getStudentsController)
);

router.get(
  '/:studentsId',
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  isValidId,
  ctrlWrapper(controllers.getStudentByIdController)
);

router.delete(
  '/:studentsId',
  checkRoles(ROLES.TEACHER),
  isValidId,
  ctrlWrapper(controllers.deleteStudentsController)
);

router.post(
  '/',
  checkRoles(ROLES.TEACHER),
  upload.single('photo'),
  validateBody(validations.createStudentSchema),
  ctrlWrapper(controllers.createStudentController)
);

router.put(
  '/:studentId',
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  upload.single('photo'),
  validateBody(validations.createStudentSchema),
  ctrlWrapper(controllers.upsertStudentController)
);

router.patch(
  '/:studentId',
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  upload.single('photo'),
  validateBody(validations.updateStudentSchema),
  ctrlWrapper(controllers.patchStudentController)
);

export default router;
