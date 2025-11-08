import express from 'express';
import { isAuthenticated, restrictTo } from '../middlewares/auth.middleware.js';
import { uploadSingle } from '../middlewares/multer.middleware.js';
import {
  createApplication,
  getApplicationsForJob,
} from '../controllers/application.controller.js';

const router = express.Router();

// Job seeker
// 1) Post an application for a job
// 2) Get application I have posted
// 3) Get applications posted by employer using his id
// 4) Get application based on the job title

// Employer
// 1) View the applications
// 2) Change the status of the application

router.post(
  '/apply/:slug',
  isAuthenticated,
  restrictTo('JOB_SEEKER'),
  uploadSingle('resume'),
  createApplication
);

// Get all the applications
router.get(
  '/:slug',
  isAuthenticated,
  restrictTo('EMPLOYER'),
  getApplicationsForJob
);

export default router;
