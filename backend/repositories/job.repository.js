import Job from '../models/job.model.js';

export const JobRepository = {
  create: async (jobData) => await Job.create(jobData),

  // Find jobs along with query
  find: async (query) =>
    await Job.find(query)
      .populate({
        path: 'company',
        select: 'name description',
      })
      .sort({
        createdAt: -1,
      }),

  findJobBySlug: async (slug) =>
    await Job.findOne({ slug }).populate('postedBy'),

  // UPDATE
  update: async (slug, jobData) => {
    // console.log('ORIGINAL SLUG: ', slug);
    // console.log('JOB DATA: ', jobData);
    const data = await Job.findOneAndUpdate({ slug }, jobData, {
      new: true,
      runValidators: true,
    });
    return data;
  },

  // DELETE
  delete: async (slug) => await Job.deleteOne({ slug }),

  findJobsByUserId: async (userId) => await Job.find({ postedBy: userId }),

  // Check Job Ownership
  // isJobOwnedByUser: async (jobSlug, userId) => a,

  // Find all existing slugs with the similar pattern for
  // generating "progressive slug"
  existingJobSlug: async (slugRegex) => {
    return await Job.find({
      slug: {
        $regex: slugRegex,
      },
    });
  },
};
