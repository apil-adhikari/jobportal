import applicationService from '../services/application.service.js';
import catchAsyncError from '../utils/catchAsyncError.js';

export const createApplication = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const { slug: jobSlug } = req.params;
  const resumeFile = req.file;

  console.log(req.body); // resume file sent to service
  const application = await applicationService.applyToJob(
    userId,
    jobSlug,
    resumeFile,
    req.body
  );

  res.status(201).json({
    message: 'You have applied successfully for this job',
    success: true,
    application,
  });
});

// Find applications for a job
export const getApplicationsForJob = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const jobSlug = req.params.slug;

  const results = await applicationService.getApplicationsForJob(
    jobSlug,
    userId
  );

  res.status(200).json({
    success: 'true',
    message: `${results.length} applications found`,
  });
});
