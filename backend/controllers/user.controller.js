import { userService } from '../services/user.service.js';
import catchAsyncError from '../utils/catchAsyncError.js';

export const update = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const userData = req.body;
  // support both single and multi-field upload
  const files = req.files || (req.file ? { file: req.file } : undefined);

  const result = await userService.updateUserProfile(userId, userData, files);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    ...result,
  });
});

export const getCurrentUser = catchAsyncError(async (req, res) => {
  const user = await userService.getCurrentUser(req.user._id);

  res.status(200).json({ success: true, user });
});

export const getMyProfile = catchAsyncError(async (req, res) => {
  const profile = await userService.getProfile(req.user._id);

  res.status(200).json({ success: true, profile });
});

export const deleteMyAccount = catchAsyncError(async (req, res) => {
  await userService.deleteAccount(req.user._id);
  res
    .status(200)
    .json({ success: true, message: 'Account deleted successfully' });
});
