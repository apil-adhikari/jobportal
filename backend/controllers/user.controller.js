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
