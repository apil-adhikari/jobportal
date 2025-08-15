import express from 'express';
import {
  isAuthenticated,
  restrictTo,
} from '../../middlewares/auth.middleware.js';
import {
  createJob,
  deleteJob,
  getJobsCreatedByEmployer,
  updateJob,
} from '../../controllers/job.controller.js';

const router = express.Router();

// Apply auth for all employer routes
router.use(isAuthenticated, restrictTo('EMPLOYER'));

router.get('/my-job-postings', getJobsCreatedByEmployer);
router.post('/', createJob);
router.patch('/:slug', updateJob);
router.delete('/:slug', deleteJob);

export default router;
