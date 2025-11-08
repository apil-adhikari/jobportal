import Job from '../models/job.model.js';

const JobRepository = {
  create: async (jobData) => await Job.create(jobData),

  // Find jobs along with query
  find: async (query) =>
    await Job.find(query)
      .populate({
        path: 'company',
        select: 'name website description industry location -_id',
      })
      .populate({
        path: 'postedBy',
        select: 'name email phoneNumber -_id',
      })
      .sort({
        createdAt: -1,
      })
      .select('-_id')
      .sort({ createdAt: -1 }),

  findJobBySlug: async (slug) =>
    await Job.findOne({ slug })
      .populate({
        path: 'postedBy',
        select: 'name email role _id',
      })
      .populate({
        path: 'company',
        select: 'name description website industry location -_id',
      }),

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

export default JobRepository;
