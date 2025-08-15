// JOB SERVICE

import slugify from 'slugify';
import { JobRepository } from '../repositories/job.repository.js';
import ApiError from '../utils/ApiError.js';
import {
  findUniqueSlug,
  generateBaseSlug,
} from '../utils/uniqueSlugGeneration.js';
import Job from '../models/job.model.js';

export const jobService = {
  // userId & jobData are required
  createJob: async (userId, jobData) => {
    const {
      title,
      description,
      location,
      type,
      salaryMin,
      salaryMax,
      experience,
      company,
      position,
    } = jobData;

    // Validate the required fields
    if (!title || !type || !company || !position) {
      throw new ApiError('All required fields must be filled.', 400);
    }

    // TODO: verfiry the ownership of the company
    // const isOwner = await companyService.isCompanyOwner(companyId, userId);

    // Finding the company for progressive slug(*** VERY IMPORTANT)
    // SLUG GENERATION
    const baseSlug = generateBaseSlug(title);
    const uniqueSlug = await findUniqueSlug(baseSlug);

    return await JobRepository.create({
      title,
      description,
      location,
      type,
      salaryMin,
      salaryMax,
      experience,
      company,
      position,
      slug: uniqueSlug,
      postedBy: userId,
    });
  },

  //  UPDATE JOB SERVICE
  updateJob: async (slug, userId, jobData) => {
    console.log(slug);
    // Find the job
    const existingJob = await JobRepository.getOne(slug);
    console.log('JOB FOUND:', existingJob);

    // if job doesnot exists
    if (!existingJob) {
      throw new ApiError('Job not found', 404);
    }

    // Check if the user trying to update the job data under certain company is the owner of the company
    const isLoggedInUserJobOwner = existingJob.postedBy.equals(userId);
    if (!isLoggedInUserJobOwner) {
      throw new ApiError(
        'You cannot update this JOB post because you are not owner of this job',
        403
      );
    }

    // RECEIVE THE REQ.BODY DATA (perform checks)
    const {
      title,
      description,
      location,
      type,
      salaryMin,
      salaryMax,
      experience,
      postedBy,
      position,
    } = jobData;

    // If the job title is changed, update the slug(NOTE: This must be update throughout the application where the slug is linked)
    let baseSlug;
    let uniqueSlug;

    // SLUG GENERATION: Check if the title is modified. Generate the slug only if modified
    console.log(existingJob.title === title);
    if (existingJob.title !== title) {
      baseSlug = generateBaseSlug(title);
      console.log(baseSlug);
      uniqueSlug = await findUniqueSlug(baseSlug);
      console.log('Unique slug when updating job: ', uniqueSlug);
    }

    // SEND THE DATA TO UPDATE IN THE REPOSITORY
    return await JobRepository.update(slug, {
      title,
      description,
      location,
      type,
      salaryMin,
      salaryMax,
      experience,
      postedBy: userId,
      position,
      slug: uniqueSlug ? uniqueSlug : slug,
    });
  },

  // DELETE JOB
  deleteJob: async (slug, userId) => {
    console.log(typeof slug);
    // find if the job exists: getOneJob
    const existingJob = await JobRepository.getOne(slug);
    console.log(existingJob);
    // check if the job is posted by the logged in user: can be checked if the job is found
    if (!existingJob) {
      throw new ApiError('No job found.', 404);
    }

    if (!existingJob.postedBy.equals(userId)) {
      throw new ApiError(
        'You are not authorized to delte this post. You are not the owner of this JOB Post.',
        403
      );
    }

    // delete the job
    return await JobRepository.delete(slug);
  },

  // JOB CREATED BY LOGGED IN USER
  getJobsCreatedByMe: async (userId) => {
    const jobs = await JobRepository.findJobsByUserId(userId);

    if (!jobs) {
      throw new ApiError(
        'You have not posted any Jobs yet. Please post some jobs to view them here.',
        404
      );
    }

    return jobs;
  },
};
