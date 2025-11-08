import Application from '../models/application.model.js';

const ApplicationRepository = {
  findAppliedApplication: async (userId, jobId) =>
    await Application.findOne({
      user: userId,
      job: jobId,
    }),

  createApplication: async (applicationData) =>
    (await Application.create(applicationData)).populate('user'),

  // TODO: Make use of aggregation pipeline with match, pagination, sorting, unwrap and facet features in v2
  findApplicationsByJobId: async (jobId) =>
    await Application.find({ job: jobId }).populate('user'),

  findApplicationsByUserId: async (userId) =>
    await Application.find({ user: userId }).populate('job'),
};

export default ApplicationRepository;
