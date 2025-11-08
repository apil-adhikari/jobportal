import express from 'express';
import {
  deleteMyAccount,
  getCurrentUser,
  getMyProfile,
  update,
} from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { uploadProfileFields } from '../middlewares/multer.middleware.js';

const router = express.Router();

// Use uploadProfileFields to allow optional 'profilePicture' and/or 'resume' files
router.put('/update', isAuthenticated, uploadProfileFields(), update);
router.get('/me', isAuthenticated, getCurrentUser);
router.get('/my-profile', isAuthenticated, getMyProfile);
router.delete('/delete', isAuthenticated, deleteMyAccount);

export default router;
