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
    experience: String,

    resumeUrl: String, // S3/Cloudinary
    resumeOriginalName: String,
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
