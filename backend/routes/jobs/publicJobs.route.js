import express from 'express';
import { getAllJobs, getJob } from '../../controllers/job.controller.js';

const router = express.Router();

// Public routes

router.get('/', getAllJobs);
router.get('/:slug', getJob);

export default router;
