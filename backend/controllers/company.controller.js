import slugify from 'slugify';
import Company from '../models/company.model.js';

// role = "EMPLOYER" can create a company

export const createCompany = async (req, res) => {
  try {
    const { name, description, website, logoUrl, industry, location } =
      req.body;

    if (!name) {
      return res.status(400).json({
        message: 'Company name is required',
        success: false,
      });
    }

    // Create the slug
    const slug = slugify(name, { lower: true, strict: true });

    let existingCompany = await Company.findOne({
      slug,
    });

    if (existingCompany) {
      return res.status(400).json({
        message: 'Cannot create another company with same name',
        success: false,
      });
    }

    const company = new Company({
      user: req.user._id,
      name,
      description,
      website,
      logoUrl,
      industry,
      location,
      slug,
    });

    await company.save();

    res.status(201).json({
      message: 'Company created successfully',
      company,
      success: true,
    });
  } catch (error) {
    console.log('Error creating company', error);
    res.status(500).json({
      // message: 'Internal Server Error',
      message: error,
      success: false,
    });
  }
};

// Get My Company (for logged in company owner)
export const getMyCompany = async (req, res) => {
  try {
    console.log('GETTING MY COMPANY...');
    const userId = req.user._id;
    // Get company created by the logged in user
    const company = await Company.find({ user: userId });
    if (!company) {
      return res.status(404).json({
        message: 'You do not have any company registered',
        success: false,
      });
    }

    res.status(200).json({
      result: `${company.length}`,
      company,
      success: true,
    });
  } catch (error) {
    console.log('Error getting your company', error);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};

// Get company by slug (public route)
export const getCompany = async (req, res) => {
  try {
    const companyName = req.params.slug;
    const company = await Company.findOne({ slug: companyName }).populate(
      'user',
      '-password'
    );

    if (!company) {
      return res.status(404).json({
        message: 'Company not found',
        success: false,
      });
    }

    res.status(200).json({
      company,
    });
  } catch (error) {
    console.log('Error getting company', error);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};

// UPDATE COMPANY (only by owner)
export const updateCompany = async (req, res) => {
  try {
    // User should be logged in
    // User should be owner of the company tring to update
    const userId = req.user._id;
    let companyName = req.params.slug;

    const company = await Company.findOne({ slug: companyName }).populate(
      'user',
      '-password'
    );

    if (!company) {
      return res.status(404).json({
        message: 'Company not found',
        success: false,
      });
    }

    if (!company.user.equals(userId)) {
      return res.status(403).json({
        message: 'You are not the owner of this company',
      });
    }

    const { name, description, website, logoUrl, industry, location } =
      req.body;

    if (name) {
      company.name = name;
      company.slug = slugify(name, {
        lower: true,
        strict: true,
      });
    }

    company.description = description || company.description;
    company.website = website || company.website;
    company.logoUrl = logoUrl || company.logoUrl;
    company.industry = industry || company.industry;
    company.location = location || company.location;

    await company.save();

    res.status(200).json({
      message: 'Comapany updated successfully',
      company,
      success: true,
    });
  } catch (error) {
    console.log('Error updating company info', error);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};

// Delete company
export const deleteCompany = async (req, res) => {
  try {
    const userId = req.user._id;
    let companyName = req.params.slug;

    const company = await Company.findOne({
      slug: companyName,
    });

    if (!company) {
      return res
        .status(404)
        .json({ message: 'Company not found', success: false });
    }

    // Check for the ownership
    if (!company.user.equals(userId)) {
      return res.status(403).json({
        message: 'You are not the owner of this company',
        success: false,
      });
    }

    await Company.findOneAndDelete({ slug: companyName });

    res
      .status(204)
      .json({ message: 'Company deleted successfully', success: true });
  } catch (error) {
    console.log('Error deleting company', error);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};

// Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const comapanies = await Company.find().populate('user', '-password');
    res.status(200).json({
      result: `${comapanies.length} companies found`,
      success: true,
      comapanies,
    });
  } catch (error) {
    console.log('Error getting companies');
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};
