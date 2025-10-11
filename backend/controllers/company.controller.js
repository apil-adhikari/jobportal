import slugify from 'slugify';
import Company from '../models/company.model.js';
import { catchAsyncError } from '../utils/catchAsyncError.js';
import { companyService } from '../services/company.service.js';

// role = "EMPLOYER" can create a company

/**Create a Company
 * - user should be logged in to create a company
 * - user with role "EMPLOYER" can create a company
 */

/** Get My Company (for logged in company owner)
 * - Gets the companies created by the logged in user
 */

export const createCompany = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  const company = await companyService.createCompany(userId, req.body);

  res.status(201).json({
    message: 'Company created successfully.',
    company,
  });
});

export const getMyCompanies = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id; // Employeer(loggeed in user)
  const myCompanies = await companyService.getMyCompanies(userId);

  res.status(200).json({
    message: `${
      myCompanies.length > 0
        ? `${myCompanies.length} companies found`
        : `No company found.`
    }`,
    status: 'success',
    companies: myCompanies,
  });
});

/** UPDATE COMPANY (only by owner)
 * - user should be logged in
 * - the user should be the owner of the company
 */

export const updateCompany = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id; // Logged-in user (EMPLOYER)
  const companySlug = req.params.slug; // Company identifier
  const companyData = req.body; // Incoming data (partial-update)

  const updatedCompany = await companyService.updateCompany(
    userId,
    companySlug,
    companyData
    // Pass the logo url later (req.file)
  );

  res.status(200).json({
    success: true,
    message: 'Company updated successfully',
    company: updatedCompany,
  });
});

export const deleteCompany = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const companySlug = req.params.slug;

  const deletedCompany = await companyService.deleteCompany(
    userId,
    companySlug
  );

  res.status(204).json({
    status: 'success',
    message: 'Company deleted successfully.',
  });
});

export const getCompany = catchAsyncError(async (req, res, next) => {
  const companySlug = req.params.slug;

  const company = await companyService.getCompany(companySlug);

  res.status(200).json({
    status: 'success',
    company,
  });
});

export const getAllCompanies = catchAsyncError(async (req, res, next) => {
  const companies = await companyService.getCompanies();

  res.status(200).json({
    status: 'success',
    result: `${companies.length} companies found`,
    companies,
  });
});

// // Get all companies
// export const getAllCompanies = async (req, res) => {
//   try {
//     const comapanies = await Company.find(
//       {},
//       { __v: 0, createdAt: 0, updatedAt: 0 } // PROJECTION on company detail
//     ).populate('user', '-password -__v -updatedAt -createdAt -_id'); // populating the fields inside the field
//     res.status(200).json({
//       result: `${comapanies.length} companies found`,
//       success: true,
//       comapanies,
//     });
//   } catch (error) {
//     console.log('Error getting companies', error);
//     res.status(500).json({
//       message: 'Internal Server Error',
//       success: false,
//     });
//   }
// };
