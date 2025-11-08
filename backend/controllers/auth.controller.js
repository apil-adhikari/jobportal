import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authService } from '../services/auth.service.js';
import catchAsyncError from '../utils/catchAsyncError.js';

export const register = catchAsyncError(async (req, res, next) => {
  const user = await authService.registerUser(req.body);
  console.log(user);

  res.status(201).json({
    message: 'User registered successfully',
    user,
    success: true,
  });
});

export const verifyEmail = catchAsyncError(async (req, res, next) => {
  const { email, token } = req.body;
  const result = await authService.verifyEmail(email, token);
  res.status(200).json({ success: true, ...result });
});

export const resendVerification = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const result = await authService.resendVerification(email);
  res.status(200).json({ success: true, ...result });
});

export const login = catchAsyncError(async (req, res, next) => {
  const { user, token } = await authService.loginUser(req.body);
  console.log(user);

  res
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'PRODUCTION', // HTTPS only in prod
      sameSite: 'lax', // CSRF protection
      maxAge: 1000 * 60 * 15, // 15 minutes
    })
    .status(200)
    .json({
      success: true,
      message: `Welcome back ${user.name}`,
      user,
    });
});

/** LOGOUT CONTROLLER:
 * - Separeate this controller when we have the logic of
 *  blacklisting toknes, refresh tokens.
 * - this helps to make the business logic at one place and helps when performing testing
 */

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie('token', '', {
      maxAge: 0,
    })
    .json({
      message: 'Logged out successfully',
      success: true,
    });
});
