// File: src/services/user.service.js

import { UserRepository } from '../repositories/user.repository.js';
import ApiError from '../utils/ApiError.js'; // Assuming this utility exists
import getUpdatedFields from '../utils/getUpdatedFields.js'; // Assuming this utility exists
import uploadToCloudinary from '../utils/uploadToCloudinary.js';
import cloudinary from '../config/cloudinary.js';

export const userService = {
  /**
   * Handles the update of both the core User data and the linked Profile data.
   * @param {string} userId - The ID of the user being updated.
   * @param {object} userData - The data received from the request body.
   */
  updateUserProfile: async (userId, userData, files) => {
    // 1. Validation and existence check
    if (userData.role) {
      throw new ApiError('You cannot update your role', 403);
    }

    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // 2. Define allowed fields
    const allowedUserFields = ['name', 'email', 'phoneNumber'];
    const allowedProfileFields = [
      'bio',
      'location',
      'skills',
      'education',
      'experience',
    ];

    let profilePictureOriginalName, profilePictureUrl, profilePicturePublicId;
    let resumeOriginalName, resumeUrl, resumePublicId;

    // --- Core User Update ---
    const userUpdates = getUpdatedFields(user, userData, allowedUserFields);

    const updatedUser =
      Object.keys(userUpdates).length > 0
        ? await UserRepository.updateUser(userId, userUpdates)
        : user;

    // --- Profile Update ---
    // Fetch profile ONCE
    const currentProfile =
      (await UserRepository.findUserProfileByUserId(userId)) || {};

    // Determine the fields that actually changed for the profile
    const profileUpdates = getUpdatedFields(
      currentProfile,
      userData,
      allowedProfileFields
    );

    // Update or create profile only if there are changes
    // If files were uploaded, handle them (profile picture / resume)
    // We'll upload new assets first, then update DB. After successful DB update
    // we'll delete old assets. If DB update fails we'll clean up newly uploaded assets.
    if (files) {
      // files may be an object like { profilePicture: [file], resume: [file] }
      // or can be custom depending on middleware; normalize access
      const profilePicFile =
        Array.isArray(files.profilePicture) && files.profilePicture.length
          ? files.profilePicture[0]
          : undefined;

      const resumeFile =
        Array.isArray(files.resume) && files.resume.length
          ? files.resume[0]
          : undefined;

      // Keep track of previous public ids so we can delete them after successful update
      const oldProfilePicId = currentProfile.profilePicturePublicId;
      const oldResumeId = currentProfile.resumePublicId;

      // Track newly uploaded ids in case we need to rollback
      let newProfilePicId;
      let newResumeId;

      // Upload profile picture
      if (profilePicFile && profilePicFile.buffer) {
        const uniqueName = `${userId}-profile-${Date.now()}`;
        const result = await uploadToCloudinary(
          profilePicFile.buffer,
          'profile_pictures',
          uniqueName
        );
        profilePictureUrl = result.secure_url;
        profilePicturePublicId = result.public_id;
        newProfilePicId = profilePicturePublicId;
        profilePictureOriginalName = profilePicFile.originalname;
        profileUpdates.profilePictureUrl = profilePictureUrl;
        profileUpdates.profilePictureOriginalName = profilePictureOriginalName;
        profileUpdates.profilePicturePublicId = profilePicturePublicId;
      }

      // Upload resume
      if (resumeFile && resumeFile.buffer) {
        const uniqueName = `${userId}-resume-${Date.now()}`;
        const result = await uploadToCloudinary(
          resumeFile.buffer,
          'resumes',
          uniqueName
        );
        resumeUrl = result.secure_url;
        resumePublicId = result.public_id;
        newResumeId = resumePublicId;
        resumeOriginalName = resumeFile.originalname;
        profileUpdates.resumeUrl = resumeUrl;
        profileUpdates.resumeOriginalName = resumeOriginalName;
        profileUpdates.resumePublicId = resumePublicId;
      }

      // If there are no profileUpdates (e.g., files object existed but no files inside)
      // we should not attempt to update DB or delete anything.
    }

    // If there are updates (fields or newly uploaded files) then persist them.
    let updatedProfile;
    if (Object.keys(profileUpdates).length > 0) {
      try {
        updatedProfile = await UserRepository.updateOrCreateUserProfile(
          userId,
          profileUpdates
        );
      } catch (err) {
        // DB update failed: cleanup newly uploaded assets to avoid orphaned files
        try {
          if (typeof newProfilePicId !== 'undefined') {
            await cloudinary.uploader.destroy(newProfilePicId, {
              resource_type: 'auto',
            });
          }
          if (typeof newResumeId !== 'undefined') {
            await cloudinary.uploader.destroy(newResumeId, {
              resource_type: 'auto',
            });
          }
        } catch (cleanupErr) {
          // log cleanup failure, but prefer to throw original error
          console.warn('Failed to cleanup newly uploaded assets:', cleanupErr);
        }

        throw err; // rethrow original DB error
      }

      // After successful DB update delete old assets if we replaced them
      try {
        if (
          typeof newProfilePicId !== 'undefined' &&
          currentProfile.profilePicturePublicId
        ) {
          await cloudinary.uploader.destroy(
            currentProfile.profilePicturePublicId,
            {
              resource_type: 'auto',
            }
          );
        }

        if (
          typeof newResumeId !== 'undefined' &&
          currentProfile.resumePublicId
        ) {
          await cloudinary.uploader.destroy(currentProfile.resumePublicId, {
            resource_type: 'auto',
          });
        }
      } catch (delErr) {
        // Not critical: log and continue
        console.warn('Failed to delete old assets from Cloudinary:', delErr);
      }
    } else {
      updatedProfile = currentProfile; // no changes
    }

    return { user: updatedUser, profile: updatedProfile };
  },

  /** Gets the core user document. */
  getCurrentUser: async (userId) => {
    const user = await UserRepository.findById(userId);
    if (!user) throw new ApiError('User not found', 404);
    // Note: The toJSON method on the user model handles stripping the password
    return user;
  },

  /** Gets the user's profile document. */
  getProfile: async (userId) => {
    const profile = await UserRepository.findUserProfileByUserId(userId);
    if (!profile) throw new ApiError('Profile not found', 404);
    return profile;
  },

  /** Handles the deletion of both the user and their associated profile. */
  deleteAccount: async (userId) => {
    // NOTE: In a production environment, this should ideally be wrapped in a
    // MongoDB Transaction to ensure both deletions succeed or both fail (atomicity).
    // Here we attempt to delete Cloudinary assets referenced in the profile
    // (if any) before deleting DB documents. Failures to delete assets are
    // logged but do not block account deletion.
    const profile = await UserRepository.findUserProfileByUserId(userId);
    if (profile) {
      try {
        if (profile.profilePicturePublicId) {
          await cloudinary.uploader.destroy(profile.profilePicturePublicId, {
            resource_type: 'auto',
          });
        }
      } catch (err) {
        console.warn(
          `Failed to delete profile picture for user ${userId}:`,
          err
        );
      }

      try {
        if (profile.resumePublicId) {
          await cloudinary.uploader.destroy(profile.resumePublicId, {
            resource_type: 'auto',
          });
        }
      } catch (err) {
        console.warn(`Failed to delete resume for user ${userId}:`, err);
      }
    }

    // Delete DB records regardless of cloudinary deletion result
    await UserRepository.deleteProfile(userId);
    await UserRepository.deleteUser(userId);
  },
};
