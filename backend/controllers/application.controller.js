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
    results,
  });
});

// Update application status (by Employer)
export const updateApplicationStatusByEmployer = catchAsyncError(
  async (req, res, next) => {
    const userId = req.user._id; //Logged in user
    const applicationId = req.params.applicationId; // application id
    const { status } = req.body; // Incoming status data (partial-update)

    const result = await applicationService.updateApplicationStatusByEmployer(
      userId,
      applicationId,
      status
    );

    res.status(200).json({
      success: true,
      message: 'Status Updated',
      result,
    });
  }
);

// Update my application
export const updateMyApplication = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const applicationId = req.params.applicationId;
  const newResumeFile = req.file;

  const result = await applicationService.updateApplicationByApplicant(
    userId,
    applicationId,
    newResumeFile,
    req.body
  );

  res.status(200).json({
    success: true,
    message: 'Application updated successfully',
    result,
  });
});
