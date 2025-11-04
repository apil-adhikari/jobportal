import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

// 1. Define the function
const uploadToCloudinary = (buffer, folder, uniqueName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: uniqueName,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// 2. Export it as the default export
export default uploadToCloudinary;
