import mongoose from 'mongoose';
import slugify from 'slugify';

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
      required: true,
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    position: {
      type: Number,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// jobSchema.pre('save', function (next) {
//   if (this.isModified('title')) {
//     this.slug = slugify(this.title, {
//       lower: true,
//       strict: true,
//     });
//   }
// });

const Job = mongoose.model('Job', jobSchema);
export default Job;
