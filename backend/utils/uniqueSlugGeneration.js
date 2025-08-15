import slugify from 'slugify';
import { JobRepository } from '../repositories/job.repository.js';

export const generateBaseSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};

/**
 * :::OPTIMZATION:::
 * - Creating seprate `slugCounter` schema to keep track of slug name and its count value
 */

export const findUniqueSlug = async (baseSlug) => {
  // Match the slug like "frontend-developer","frontend-developer-1","frontend-developer-2",...
  const slugRegex = new RegExp(`^${baseSlug}(-\\d)?$`, 'i');

  // Find all existing slugs with the similar pattern:
  // const existingRecords = await model.find({
  //   slug: {
  //     $regex: slugRegex,
  //   },
  // });
  // JOB Repository should be called
  const existingJobSlug = await JobRepository.existingJobSlug(slugRegex);
  // console.log('Existing Job Slugs: ', existingJobSlug);

  if (existingJobSlug.length === 0) {
    // If no slug conflict, return the base with -1 added at the end:
    return `${baseSlug}-1`;
  }

  // Extract all numbers
  const slugNumbers = existingJobSlug.map((record) => {
    const match = record.slug.match(/-(\d+)$/);
    return match ? parseInt(match[1]) : 0;
  });

  // Find the highest number used, increment it
  const nextNumber = Math.max(...slugNumbers) + 1;

  return `${baseSlug}-${nextNumber}`;
};
