import applicationService from '../services/application.service.js';
import catchAsyncError from '../utils/catchAsyncError.js';

export const createApplication = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const resumeFile = req.file;
  console.log(req.body); // resume file sent to service
  const application = await applicationService.applyToJob(
    userId,
    resumeFile,
    req.body
  );

  res.status(201).json({
    message: 'You have applied successfully for this job',
    success: true,
    application,
  });
});
