import Job from '../models/job.model.js';

export const JobRepository = {
  create: async (jobData) => await Job.create(jobData),
};
