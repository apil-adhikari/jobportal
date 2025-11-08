import mongoose from 'mongoose';
import validAplicationStatus from '../constants/validAplicationStatus.js';

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

    // Resume
    resumeUrl: {
      type: String,
    },

    resumeOriginalName: { type: String }, // Original file name

    status: {
      type: String,
      enum: validAplicationStatus,
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

applicationSchema.index({ job: 1, user: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
