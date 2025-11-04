import express, { urlencoded } from 'express';
import './config/dotenv.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';

import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import companyRouter from './routes/company.route.js';
import publicJobsRouter from './routes/jobs/publicJobs.route.js';
import employerJobsRouter from './routes/jobs/employerJobs.route.js';
import { globalErrorHanlder } from './middlewares/error.middleware.js';
import applicationRouter from './routes/application.route.js';

const app = express();

// MIDDLEWARE
app.use(express.json()); // Parse req.body data
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Options
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

app.use(cors(corsOptions));

app.get('/home', (req, res) => {
  res.status(200).json({
    message: 'Hello from backend',
    success: true,
  });
});

const PORT = process.env.PORT || 8001;

connectDB();

// APIs
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/company', companyRouter);
app.use('/api/v1/jobs', publicJobsRouter);
app.use('/api/v1/jobs/employer', employerJobsRouter);
app.use('/api/v1/applications', applicationRouter);

app.use(globalErrorHanlder);
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server started successfully on port ${PORT}`);
});

export default app;
