import express from 'express';
import { isAuthenticated, restrictTo } from '../middlewares/auth.middleware.js';
import {
  createCompany,
  deleteCompany,
  getAllCompanies,
  getCompany,
  getMyCompany,
  updateCompany,
} from '../controllers/company.controller.js';

const router = express.Router();

router.post('/', isAuthenticated, restrictTo('EMPLOYER'), createCompany); // Create Company
router.get('/my', isAuthenticated, restrictTo('EMPLOYER'), getMyCompany); // Get my Company

router.put('/:slug', isAuthenticated, restrictTo('EMPLOYER'), updateCompany); // Update a Company
router.delete('/:slug', isAuthenticated, restrictTo('EMPLOYER'), deleteCompany);

router.get('/:slug', getCompany); // Get a Company
router.get('/', getAllCompanies);

export default router;
