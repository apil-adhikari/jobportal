import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: { type: String },

    startYear: { type: Number },
    endYear: { type: Number },

    grade: {
      type: String,
      trim: true,
      // Example values: "Distinction", "First Division", "A+", "3.9 GPA"
    },

    gpa: {
      type: Number,
      min: 0,
      max: 10, // supports 4- or 10-point systems
    },

    gradingSystem: {
      type: String,
      enum: ['GPA_4', 'GPA_10', 'PERCENTAGE', 'DIVISION', 'LETTER'],
      default: 'GPA_4',
    },
  },
  { timestamps: true }
);

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    position: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String },
  },
  { timestamps: true }
);

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

    skills: {
      type: [String],
      default: [],
    },
    education: [educationSchema],
    experience: [experienceSchema],
    location: String,

    resumeUrl: String, // S3/Cloudinary
    resumeOriginalName: String,
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
