import { CompanyRepository } from '../repositories/company.repository.js';
import ApiError from '../utils/ApiError.js';
import { getUpdatedFields } from '../utils/getUpdatedFields.js';
import { generateBaseSlug } from '../utils/uniqueSlugGeneration.js';

export const companyService = {
  createCompany: async (userId, companyData) => {
    const { name, description, website, logoUrl, industry, location } =
      companyData;

    // Validatint the fields
    if (!name) {
      throw new ApiError('Company is required!', 400);
    }

    // Company Slug Generation:
    const slug = generateBaseSlug(name);
    console.log(slug);

    // Check if there exixts company with same name.
    const existingCompany = await CompanyRepository.findCompanyBySlug(slug);
    console.log(existingCompany);

    if (existingCompany) {
      throw new ApiError(
        'A company already exists with same name. To verify your company, please contact admin',
        409
      );
    }

    return await CompanyRepository.createCompany({
      createdBy: userId,
      name,
      description,
      website,
      logoUrl,
      industry,
      location,
      slug,
    });
  },

  // There could be no company registered by the user,
  // If companies are registered, then
  getMyCompanies: async (userId) => {
    const myCompanies = await CompanyRepository.findCompaniesCreatedByEmployer(
      userId
    );

    // If there are not companies, then it is not an error
    // if (myCompanies.length == 0) {
    //   throw new ApiError('You have not created any company yet.', 200);
    // }

    return myCompanies;
  },

  updateCompany: async (userId, companySlug, companyData) => {
    // Find company by slug
    let company = await CompanyRepository.findCompanyBySlug(companySlug);

    if (!company) {
      throw new ApiError('Company not found', 404);
    }

    // Check the ownership
    if (company.createdBy.toString() !== userId.toString()) {
      throw new ApiError('You are not authorized to update this company', 403);
    }

    // Allowed fields allowed to be updated
    const allowedFields = [
      'name',
      'description',
      'location',
      'website',
      'logo',
    ];

    const updates = getUpdatedFields(company, companyData, allowedFields);

    // TODO update the logo in Cloudinary

    // No changes, skip DB write
    if (Object.keys(updates).length === 0) {
      return company;
    }

    company = await CompanyRepository.updateCompanyBySlug(companySlug, updates);

    return company;
  },

  deleteCompany: async (userId, companySlug) => {
    // Find company by slug
    let company = await CompanyRepository.findCompanyBySlug(companySlug);

    if (!company) {
      throw new ApiError('Company not found', 404);
    }

    // Check the ownership
    if (company.createdBy.toString() !== userId.toString()) {
      throw new ApiError('You are not authorized to delete this company', 403);
    }

    return await CompanyRepository.deleteCompanyBySlug(companySlug);
  },

  getCompany: async (companySlug) => {
    const company = await CompanyRepository.findCompanyBySlug(companySlug);

    if (!company) {
      throw new ApiError('Company not found', 404);
    }

    return company;
  },

  getCompanies: async () => {
    const companies = await CompanyRepository.findAllCompanies();
    return companies;
  },
};
