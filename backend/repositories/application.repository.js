import Application from '../models/application.model.js';

const ApplicationRepository = {
  findAppliedApplication: async (userId, jobId) =>
    await Application.findOne({ user: userId, job: jobId }),

  createApplication: async (applicationData) =>
    (await Application.create(applicationData)).populate('user'),

  findApplicationsByJobId: async (jobId) =>
    await Application.find({ job: jobId }).populate('user'),

  findApplicationsByUserId: async (userId) =>
    await Application.find({ user: userId }).populate('job'),
};

export default ApplicationRepository;
