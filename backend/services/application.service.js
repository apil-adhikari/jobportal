import ApiError from '../utils/ApiError.js';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';
import ApplicationRepository from '../repositories/application.repository.js';
import JobRepository from '../repositories/job.repository.js';
import validAplicationStatus from '../constants/validAplicationStatus.js';

const applicationService = {
  // Job seeker applies for a job
  applyToJob: async (userId, jobSlug, resumeFile, applicationData) => {
    const { coverLetter } = applicationData;

    console.log(applicationData);
    console.log(typeof applicationData);

    // find job (for job slug to id resolution)
    const job = await JobRepository.findJobBySlug(jobSlug);
    if (!job) {
      throw new ApiError('Job not found', 404);
    }

    const jobId = job._id;

    // Check if the user has already applied for job
    const existingApplication =
      await ApplicationRepository.findAppliedApplication(userId, jobId);

    // DEBUG LOG
    console.log(
      'Existing Application by this USER for this JOB',
      existingApplication
    );

    if (existingApplication) {
      throw new ApiError('You have already applied for this job', 400);
    }

    let resumeUrl, resumeOriginalName;
    if (resumeFile) {
      const uniqueName = `${userId}-${Date.now()}`;
      const result = await uploadToCloudinary(
        resumeFile.buffer,
        'resumes',
        uniqueName
      );
      resumeUrl = result.secure_url;
      resumeOriginalName = resumeFile.originalname;
    }

    // Create a new Application
    const application = await ApplicationRepository.createApplication({
      job: jobId,
      user: userId,
      coverLetter,
      resumeUrl,
      resumeOriginalName,
    });

    return application;
  },

  // Get applications for a job (for employer)
  getApplicationsForJob: async (jobSlug, userId) => {
    const job = await JobRepository.findJobBySlug(jobSlug);
    if (!job) {
      throw new ApiError('No job exists!', 404);
    }

    console.log('Get all jobs ');
    console.log(job.postedBy._id);
    console.log(userId);

    // Verify the ownership:
    // if (job.postedBy.id.toString() !== userId.toString()) {
    if (!job.postedBy._id.equals(userId)) {
      throw new ApiError('Forbidden: you do not own this job', 403);
    }

    // Show the applications using jobId
    const jobId = job._id;
    return await ApplicationRepository.findApplicationsByJobId(jobId);
  },

  /**
   * Update application Status by Employer using Application Id
   */

  updateApplicationStatusByEmployer: async (
    userId,
    applicationId,
    newStatus
  ) => {
    // Find the application:
    let application = await ApplicationRepository.findApplicationById(
      applicationId
    );

    if (!application) {
      throw new ApiError('Application not found', 404);
    }

    // Check the ownership
    if (!application.job.postedBy.equals(userId)) {
      throw new ApiError('Forbidden: not your job!', 403);
    }

    // Validate the status
    if (!validAplicationStatus.includes(newStatus)) {
      throw new ApiError('Invalid application status value', 400);
    }

    console.log(application);
    console.log(userId);
    console.log(applicationId);
    console.log(newStatus);

    // If the status is same as previous status then no need to call the DB again
    if (application.status === newStatus) {
      return application;
    }

    // We need to update only the status here
    application = await ApplicationRepository.updateApplicationStatusById(
      applicationId,
      newStatus
    );

    return application;
  },

  // Get applications by users (total applications applied by user in all jobs)
  getApplicationsByUser: async (userId) => {
    return ApplicationRepository.finaApplicationsByUserId(userId);
  },

  // TODO: change application status
  // TODO: get single applciation
};

export default applicationService;
