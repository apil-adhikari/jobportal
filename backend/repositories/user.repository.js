// File: src/repositories/user.repository.js

import Profile from '../models/profile.model.js';
import User from '../models/user.model.js';

export const UserRepository = {
  // === User Model Operations ===

  /** Fetches a single User document by its Mongoose ID. */
  findById: async (userId) => await User.findById(userId),

  /** Updates a User document by ID. */
  updateUser: async (userId, userData) =>
    await User.findByIdAndUpdate(userId, userData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    }),

  /** Deletes a User document by ID. */
  deleteUser: async (userId) => await User.deleteOne({ _id: userId }),

  // === Profile Model Operations ===

  /** Finds a Profile document associated with a specific User ID. */
  findUserProfileByUserId: async (userId) =>
    await Profile.findOne({ user: userId }),

  /** Updates an existing profile or creates a new one if it doesn't exist (upsert). */
  updateOrCreateUserProfile: async (userId, profileData) =>
    await Profile.findOneAndUpdate(
      { user: userId },
      { $set: profileData },
      { new: true, runValidators: true, upsert: true } // 'upsert: true' creates if not found
    ),

  /** Deletes a Profile document associated with a specific User ID. */
  deleteProfile: async (userId) => await Profile.deleteOne({ user: userId }),
};
