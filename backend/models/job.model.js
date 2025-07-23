import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    location: String,
    type: {
      type: String,
      enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'FREELANCE'],
      required: true,
    },

    salaryMin: Number,
    salaryMax: Number,
    experience: String,
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    position: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
