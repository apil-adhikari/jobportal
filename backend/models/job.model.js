import mongoose from 'mongoose';
import slugify from 'slugify';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,

      //  Do not allow the number in job title
      validate: {
        validator: function (value) {
          // This regex checks if the string contains any digit (0-9)
          return !/\d/.test(value);
        },
        message: (props) => `${props.value} should not contain any number`,
      },
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

    vacancies: {
      type: Number,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },

    applicationDeadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ['OPEN', 'CLOSED', 'FILLED', 'DRAFT'],
      default: 'OPEN',
    },
  },
  {
    timestamps: true,
  }
);
jobSchema.index({ title: 'text', description: 'text', location: 'text' });
jobSchema.index({ postedBy: 1, company: 1 });

const Job = mongoose.model('Job', jobSchema);
export default Job;
