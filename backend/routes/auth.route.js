import express from 'express';
import {
  login,
  logout,
  register,
  verifyEmail,
} from '../controllers/auth.controller.js';
import { resendVerification } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/resend-verify', resendVerification);
router.post('/login', login);
router.post('/logout', logout);

export default router;
