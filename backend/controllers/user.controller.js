import Profile from '../models/profile.model.js';
import User from '../models/user.model.js';

export const update = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      name,
      email,
      phoneNumber,
      bio,
      location,
      skills,
      education,
      experience,
      resumeUrl,
      resumeOriginalName,
    } = req.body;

    // File
    const file = req.file;
    // Cloudinary Setup Here

    // 1. Update user's basic info
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phoneNumber },
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    // 2. Update or create profile info
    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      profile = new Profile({
        user: userId,
      });
    }

    profile.bio = bio || profile.bio;
    profile.location = location || profile.location;
    profile.skills = skills || profile.skills;
    profile.education = education || profile.education;
    profile.experience = experience || profile.experience;
    profile.resumeUrl = resumeUrl || profile.resumeUrl;
    profile.resumeOriginalName =
      resumeOriginalName || profile.resumeOriginalName;

    await profile.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
      profile,
      success: true,
    });
  } catch (error) {
    console.log('Error updating the profile', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

// Get Current User:
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }

    res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};

// 3. Get my profile
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate(
      'user',
      '-password'
    );

    if (!profile) {
      return res.status(404).json({
        message: 'Profile not found',
        success: false,
      });
    }

    res.status(200).json({
      profile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};

// 4. Delete account
export const deleteMyAccount = async (req, res) => {
  try {
    await Profile.deleteOne({ user: req.user._id });
    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
      message: 'Account deleted successfully',
      success: true,
    });
  } catch (error) {
    console.log('Error deleting user', error);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};
