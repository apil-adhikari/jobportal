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
    unique: true,
  },

  description: String,
  website: String,
  logoUrl: String,
  industry: String,
  location: String,
});

const Company = mongoose.model('Company', companySchema);
export default Company;
