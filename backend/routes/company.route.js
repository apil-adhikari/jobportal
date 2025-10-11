import express from 'express';
import { isAuthenticated, restrictTo } from '../middlewares/auth.middleware.js';
import {
  createCompany,
  deleteCompany,
  getAllCompanies,
  getCompany,
  getMyCompanies,
  updateCompany,
} from '../controllers/company.controller.js';

const router = express.Router();

/**
 * CRUD
 * Create a Company: A authenticated & user with role = "EMPLOYER" should be able to create a company
 * Read: Should be a public route (get a company and get all companies)
 * Get my companies: get the companies created by the user
 * Update the company details: the user who created the company should be able to update the company details
 * Delte company detail: the user who created the company should be able to delete the company
 */

router.post('/', isAuthenticated, restrictTo('EMPLOYER'), createCompany); // Create Company
router.get(
  '/my-companies',
  isAuthenticated,
  restrictTo('EMPLOYER'),
  getMyCompanies
); // Get my Companies

router.patch('/:slug', isAuthenticated, restrictTo('EMPLOYER'), updateCompany); // Update a Company
router.delete('/:slug', isAuthenticated, restrictTo('EMPLOYER'), deleteCompany);

router.get('/:slug', getCompany); // Get a Company
router.get('/', getAllCompanies);

export default router;
