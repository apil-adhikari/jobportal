import express from 'express';
import {
  login,
  logout,
  register,
  verifyEmail,
  resendVerification,
} from '../controllers/auth.controller.js';
import {
  loginLimiter,
  resendLimiter,
} from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/resend-verify', resendLimiter, resendVerification);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);

export default router;
