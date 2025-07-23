import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
    },

    bio: {
      type: String,
    },

    skills: [{ type: String }],
    education: String,
    location: String,

    resumeUrl: String, // S3/Cloudinary
    resumeOriginalName: String,
  },
  {
    timestamps: true,
  }
);

export const Profile = mongoose.model('Profile', profileSchema);
