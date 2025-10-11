import mongoose from 'mongoose';
import slugify from 'slugify';

const companySchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },

    description: String,
    website: String,
    logoUrl: String,
    industry: String,
    location: String,
    slug: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

companySchema.index({ name: 'text', industry: 'text', location: 'text' });

const Company = mongoose.model('Company', companySchema);
export default Company;
