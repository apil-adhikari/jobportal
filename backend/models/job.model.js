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

const Job = mongoose.model('Job', jobSchema);
export default Job;
