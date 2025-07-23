import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },

  description: String,
  website: String,
  logoUrl: String,
  industry: String,
  location: String,
});

export const Company = mongoose.model('Company', companySchema);
