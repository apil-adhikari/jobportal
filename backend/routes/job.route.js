import express from 'express';
import { isAuthenticated, restrictTo } from '../middlewares/auth.middleware.js';
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJob,
  getJobsCreatedByEmployeer,
  updateJob,
} from '../controllers/job.controller.js';

const router = express.Router();

// PUBLIC ROUTES
router.get('/', getAllJobs);
router.get('/:slug', getJob);

// PROTECTED ROUTES
router.post('/', isAuthenticated, restrictTo('EMPLOYER'), createJob);
router.patch('/:slug', isAuthenticated, restrictTo('EMPLOYER'), updateJob);

// GET Jobs created by logged in user:
router.get(
  '/my-job-postings',
  isAuthenticated,
  restrictTo('EMPLOYER'),
  getJobsCreatedByEmployeer
);

router.delete('/:slug', isAuthenticated, restrictTo('EMPLOYER'), deleteJob);

export default router;
