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
    await Application.find({ job: jobId })
      .populate({
        path: 'user',
        select: 'name email',
      })
      .populate({
        path: 'job',
        select: 'title',
      }),

  // find application by applicationId
  findApplicationById: async (applicationId) =>
    await Application.findById(applicationId)
      .populate({
        path: 'user',
        select: 'name email',
      })
      .populate({
        path: 'job',
        select: 'title postedBy',
      }),

  // Update the Application Status
  updateApplicationStatusById: async (applicationId, newStatus) => {
    const updatedStatus = await Application.findByIdAndUpdate(
      applicationId,
      {
        status: newStatus,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return updatedStatus;
  },

  updateApplicationById: async (
    applicationId,
    applicationData
    // updates,

    // resumeOriginalName,
    // resumeUrl,
    // resumePublicId
  ) => {
    console.log('Application DAta in repo:', applicationData);
    const updates = await Application.findOneAndUpdate(
      {
        _id: applicationId,
      },
      applicationData,
      {
        new: true,
        runValidators: true,
      }
    );

    console.log(updates);
    return updates;
  },

  findApplicationsByUserId: async (userId) =>
    await Application.find({ user: userId }).populate('job'),
};

export default ApplicationRepository;
