import { Router } from 'express';
import * as controllers from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import * as validation from '../validation/auth.js';

const router = Router();

router.get(
  '/get-oauth-url',
  ctrlWrapper(controllers.getGoogleOAuthUrlController)
);

router.post(
  '/confirm-oauth',
  validateBody(validation.loginWithGoogleOAuthSchema),
  ctrlWrapper(controllers.loginWithGoogleController)
);

router.post(
  '/register',
  validateBody(validation.registerUserSchema),
  ctrlWrapper(controllers.registerUserController)
);

router.post(
  '/login',
  validateBody(validation.loginUserSchema),
  ctrlWrapper(controllers.loginUserController)
);

router.post('/logout', ctrlWrapper(controllers.logOutUserController));

router.post('/refresh', ctrlWrapper(controllers.refreshTokenController));

router.post(
  '/request-reset-email',
  validateBody(validation.requestResetEmailSchema),
  ctrlWrapper(controllers.requestResetEmailController)
);

router.post(
  '/reset-password',
  validateBody(validation.resetPasswordSchema),
  ctrlWrapper(controllers.resetPasswordController)
);

export default router;
