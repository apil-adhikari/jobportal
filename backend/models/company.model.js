import mongoose from 'mongoose';
import slugify from 'slugify';

const companySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // unique: true,
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

// Auto generate slug before save or update
companySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
  next();
});

const Company = mongoose.model('Company', companySchema);
export default Company;
