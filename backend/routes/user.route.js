import express from 'express';
import {
  deleteMyAccount,
  getCurrentUser,
  getMyProfile,
  update,
} from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.put('/update', isAuthenticated, update);
router.get('/me', isAuthenticated, getCurrentUser);
router.get('/my-profile', isAuthenticated, getMyProfile);
router.delete('/delete', isAuthenticated, deleteMyAccount);

export default router;
