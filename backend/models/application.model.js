import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    coverLetter: {
      type: String,
    },

    status: {
      type: String,
      enum: ['PENDING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'],
      default: 'PENDING',
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;
