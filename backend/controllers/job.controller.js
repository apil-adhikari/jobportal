import slugify from 'slugify';
import Job from '../models/job.model.js';
import ApiError from '../utils/ApiError.js';
import { catchAsyncError } from '../utils/catchAsyncError.js';
import { jobService } from '../services/job.service.js';

/**
 * REQUIREMENTS:
 * 1. Employer can perform CRUD on jobs[create,read,update and mark the job position as completed]
 * - Do not delete: makr the job vaccency as fullfilled
 */

// PROTECTED ADMIN/EMPLOYER ---

export const createJob = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  // TODO: We need to check if the USER is trying to POST a job under a COMPANY, we need to check if the user is the owner of the company
  // I MUST CREATE COMPANY SERVICE FOR THIS

  const job = await jobService.createJob(userId, req.body);

  res.status(201).json({
    message: 'Job created successfully',
    success: true,
    job,
  });
});

// Update Job
export const updateJob = catchAsyncError(async (req, res) => {
  // Loggedin user
  const userId = req.user._id;
  const jobSlug = req.params.slug;

  const updatedJob = await jobService.updateJob(jobSlug, userId, req.body);

  // DELEGATE all other checks to the service layer

  // const job = await Job.findOne({
  //   slug: jobSlug,
  // });

  // if (!job) {
  //   return res.status(404).json({
  //     message: 'Job not found',
  //     success: false,
  //   });
  // }

  // // Check job ownership(is the job user trying to update is created by himself?)
  // if (!job.postedBy.equals(userId)) {
  //   return res.status(403).json({
  //     message:
  //       'You do not have permission to perform this action. YOU ARE NOT THE OWNER OF THIS POST',
  //     success: false,
  //   });
  // }

  // const {
  //   title,
  //   description,
  //   location,
  //   type,
  //   salaryMin,
  //   salaryMax,
  //   experience,
  // } = req.body;

  // // If the job title is changed, update the slug
  // if (title) {
  //   (job.title = title),
  //     (job.slug = slugify(title, {
  //       lower: true,
  //       strict: true,
  //     }));
  // }

  // Update other job details:
  // job.description = description || job.description;
  // job.location = location || job.location;
  // job.type = type || job.type;
  // job.salaryMin = salaryMin || job.salaryMin;
  // job.salaryMax = salaryMax || job.salaryMax;
  // job.experience = experience || job.experience;

  // if (description) job.description = description;
  // if (location) job.location = location;
  // if (type) job.type = type;
  // if (salaryMin) job.salaryMin = salaryMin;
  // if (salaryMax) job.salaryMax = salaryMax;
  // if (experience) job.experience = experience;

  // await job.save();

  // cons

  // return res.status(200).json({
  //   message: 'Job updated successfully',
  //   job,
  //   success: true,
  // });

  res.status(200).json({
    message: 'Job updated successfully',
    updatedJob,
  });
});

// TODO: (Marking job vacency as fulfilled, can be done in application controller)

// Delete [NOT RECOMMENDED]
export const deleteJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const jobSlug = req.params.slug;

    const job = await Job.findOne({ slug: jobSlug });
    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
        success: false,
      });
    }

    if (!job.postedBy.equals(userId)) {
      return res.status(403).json({
        message:
          'You do not have permission to perform this action. YOU ARE NOT THE OWNER OF THIS POST',
        success: false,
      });
    }

    await Job.deleteOne({ slug: jobSlug });

    res.status(204).json({
      message: 'Job deleted successfully',
      success: true,
    });
  } catch (error) {
    console.log('Error deleting job', error);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};

// Get job created by logged in user
export const getJobsCreatedByEmployeer = async (req, res) => {
  try {
    const userId = req.user._id; // EMPLOYER id(logged in user)

    const jobs = await Job.find({ postedBy: userId });
    if (!jobs) {
      return res.status(404).json({
        message: 'You have not posted any jobs yet.',
        success: false,
      });
    }

    res.status(200).json({
      result: `${jobs.length} jobs found.`,
      jobs,
      success: true,
    });
  } catch (error) {
    console.log('Error getting jobs created by employer(you)', error);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};

// PUBLIC ACCESS ---
// Get Job
export const getJob = async (req, res) => {
  try {
    // get unique job (either by slug or using id)
    const jobSlug = req.params.slug;
    const job = await Job.findOne({
      slug: jobSlug,
    });

    if (!job) {
      return res.status(400).json({
        message: 'Job not found',
        success: false,
      });
    }

    // if job found, send the job in the response
    res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log('Error getting job', error);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};

// Get all Jobs(with search by keyword)
export const getAllJobs = async (req, res) => {
  try {
    // Filtering:
    const keyword = req.query.keyword || '';

    // Query: basic query for keyword search
    const query = {
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ],
    };

    const jobs = await Job.find(query);
    if (!jobs) {
      return res.status(404).json({
        message: 'Job not found',
        success: false,
      });
    }

    res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log('Error getting all jobs', error);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};
