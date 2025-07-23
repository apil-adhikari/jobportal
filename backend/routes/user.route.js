import express from 'express';
import { update } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.put('/update', isAuthenticated, update);

export default router;
