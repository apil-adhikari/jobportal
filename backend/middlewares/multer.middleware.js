import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const memoryStorage = multer.memoryStorage();

// File filter
const fileFilter = (fieldName) => (req, file, cb) => {
  if (fieldName === 'profilePicture') {
    if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(
      new ApiError(
        'Only .png, .jpg, .jpeg files are allowed for profile picture',
        415
      )
    );
  }

  if (fieldName === 'resume') {
    if (
      [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ].includes(file.mimetype)
    ) {
      return cb(null, true);
    }
    return cb(
      new ApiError('Only .pdf or .docx files are allowed for resume', 415)
    );
  }

  cb(new ApiError('Unsupported file field', 415));
};

// Single file upload (5MB file size limit)
export const uploadSingle = (fieldName, maxSizeMB = 5) =>
  multer({
    storage: memoryStorage,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter: fileFilter(fieldName),
  }).single(fieldName);

// Multi-field upload for profile update: accepts 'profilePicture' and 'resume'
export const uploadProfileFields = (maxSizeMB = 5) =>
  multer({
    storage: memoryStorage,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      // Validate based on the incoming field name
      if (file.fieldname === 'profilePicture') {
        if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
          return cb(null, true);
        }
        return cb(
          new ApiError(
            'Only .png, .jpg, .jpeg files are allowed for profile picture',
            415
          )
        );
      }

      if (file.fieldname === 'resume') {
        if (
          [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ].includes(file.mimetype)
        ) {
          return cb(null, true);
        }
        return cb(
          new ApiError('Only .pdf or .docx files are allowed for resume', 415)
        );
      }

      cb(new ApiError('Unsupported file field', 415));
    },
  }).fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
  ]);
