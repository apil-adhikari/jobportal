import ApiError from '../utils/ApiError.js';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';
import ApplicationRepository from '../repositories/application.repository.js';

const applicationService = {
  // Job seeker applies for a job
  applyToJob: async (userId, resumeFile, applicationData) => {
    console.log(applicationData);
    const { jobId, coverLetter } = applicationData;

    // Check if the user has already applied for job
    const existingApplication =
      await ApplicationRepository.findAppliedApplication(userId, jobId);
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
  getApplicationsForJob: async (jobId) => {
    return await ApplicationRepository.findApplicationsByJobId(jobId);
  },

  // Get applications by users (total applications applied by user in all jobs)
  getApplicationsByUser: async (userId) => {
    return ApplicationRepository.finaApplicationsByUserId(userId);
  },

  // TODO: change application status
  // TODO: get single applciation
};

export default applicationService;
