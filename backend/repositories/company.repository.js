import Company from '../models/company.model.js';

export const CompanyRepository = {
  // find company by slug(2 companis cannot be of same name)
  findCompanyBySlug: async (slug) =>
    await Company.findOne({ slug }).populate('createdBy', 'name email role'),
  createCompany: async (companyData) => await Company.create(companyData),
  findCompaniesCreatedByEmployer: async (userId) =>
    await Company.find({
      createdBy: userId,
    }),
  updateCompanyBySlug: async (companySlug, updates) =>
    await Company.findOneAndUpdate({ slug: companySlug }, updates, {
      new: true,
      runValidators: true,
    }),

  deleteCompanyBySlug: async (companySlug) =>
    await Company.findOneAndDelete({ slug: companySlug }),
  findAllCompanies: async () =>
    await Company.find().populate('createdBy', 'name email role'),
};
