# Job Portal Backend

A robust backend system for a job portal application built with Node.js, Express, and MongoDB.

## Architecture

The application follows a clean architecture pattern:

```
Controller => Service => Repository
```

- **Controllers**: Handle HTTP requests/responses and data validation
- **Services**: Implement business logic and error handling
- **Repositories**: Manage database interactions

## Key Features

### Authentication & Authorization

- User registration with role-based access (Job Seeker, Employer, Admin)
- Secure login with JWT authentication
- Email verification system with OTP
- Password hashing using bcrypt
- Rate limiting for login and OTP resend endpoints

### File Management

- Profile picture and resume upload support
- Integration with Cloudinary for file storage
- File type validation and size limits
- Automatic cleanup of old files on update

### User Management

- Profile creation and updates
- Role-based access control
- Email verification status tracking
- Phone number validation

### Job Management

- CRUD operations for job listings
- Job search and filtering
- Company-specific job listings
- Job application tracking

### Company Management

- Company profile management
- Company verification system
- Multiple job posting capability

### Security Features

- Rate limiting for sensitive endpoints
- Input validation and sanitization
- Secure password handling
- Protected routes with JWT middleware
- Email verification requirement for login

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/resend-verify` - Resend verification OTP
- `POST /api/auth/logout` - User logout

### User Management

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/update` - Update user profile
- `POST /api/users/upload` - Upload profile picture/resume

### Jobs

- `POST /api/jobs` - Create new job listing
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get specific job
- `PUT /api/jobs/:id` - Update job listing
- `DELETE /api/jobs/:id` - Delete job listing

### Companies

- `POST /api/companies` - Create company profile
- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get specific company
- `PUT /api/companies/:id` - Update company profile

### Applications

- `POST /api/applications` - Submit job application
- `GET /api/applications` - Get user's applications
- `GET /api/applications/:id` - Get specific application

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with required environment variables (see example.env)
4. Start the server:
   ```bash
   npm start
   ```

## Environment Variables Required

```env
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET_KEY=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
EMAIL_FROM=your_sender_email
```

## Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **File Storage**: Cloudinary
- **Email Service**: Nodemailer
- **Security**:
  - bcrypt (password hashing)
  - express-rate-limit
  - helmet (HTTP headers)
  - cors

## Error Handling

The application implements a centralized error handling mechanism with custom ApiError class and async error wrapper.

## Future Improvements

- [ ] Implement refresh tokens
- [ ] Add pagination for list endpoints
- [ ] Implement caching layer
- [ ] Add automated testing
- [ ] Use transactions for critical operations
