import { catchAsyncError } from '../utils/catchAsyncError.js';
import { jobService } from '../services/job.service.js';

// Create new job
export const createJob = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  const job = await jobService.createJob(userId, req.body);

  res.status(201).json({
    message: 'Job created successfully',
    success: true,
    job,
  });
});

// Update job
export const updateJob = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const jobSlug = req.params.slug;

  const updatedJob = await jobService.updateJob(jobSlug, userId, req.body);

  res.status(200).json({
    message: 'Job updated successfully',
    updatedJob,
  });
});

// Delete job by slug
export const deleteJob = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const jobSlug = req.params.slug;
  console.log(jobSlug);

  const job = await jobService.deleteJob(jobSlug, userId);

  res.status(204).json({
    message: 'Job deleted successfully',
    job,
  });
});

// Job created by employer
export const getJobsCreatedByEmployer = catchAsyncError(
  async (req, res, next) => {
    const userId = req.user._id;

    const jobs = await jobService.getJobsCreatedByMe(userId);

    res.status(200).json({
      result: `Total ${jobs.length} jobs found.`,
      jobs,
    });
  }
);

// Get single job by slug
export const getJob = catchAsyncError(async (req, res, next) => {
  const jobSlug = req.params.slug;

  const job = await jobService.getJobBySlug(jobSlug);

  res.status(200).json({
    message: 'Job found successfully.',
    job,
  });
});

// Get all jobs along with filter and search
export const getAllJobs = catchAsyncError(async (req, res, next) => {
  const keyword = req.query.keyword || '';

  const jobs = await jobService.getAllJobs(keyword);

  res.status(200).json({
    result: `${jobs.length} jobs found`,
    jobs,
  });
});
