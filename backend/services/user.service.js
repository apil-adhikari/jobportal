// File: src/services/user.service.js

import { UserRepository } from '../repositories/user.repository.js';
import ApiError from '../utils/ApiError.js'; // Assuming this utility exists
import { getUpdatedFields } from '../utils/getUpdatedFields.js'; // Assuming this utility exists

export const userService = {
  /**
   * Handles the update of both the core User data and the linked Profile data.
   * @param {string} userId - The ID of the user being updated.
   * @param {object} userData - The data received from the request body.
   */
  updateUserProfile: async (userId, userData) => {
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
      'resumeUrl',
      'resumeOriginalName',
    ];

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
    const updatedProfile =
      Object.keys(profileUpdates).length > 0
        ? await UserRepository.updateOrCreateUserProfile(userId, profileUpdates)
        : currentProfile; // Return the fetched profile if no updates were needed

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
    await UserRepository.deleteProfile(userId);
    await UserRepository.deleteUser(userId);
  },
};
