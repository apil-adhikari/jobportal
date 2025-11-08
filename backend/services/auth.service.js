import { AuthRepository } from '../repositories/auth.repository.js';
import ApiError from '../utils/ApiError.js';
import { decryptPassword, encryptPassword } from '../utils/passwordHash.js';
import { generateToken } from '../utils/token.utils.js';
import emailService from '../utils/emailService.js';
import crypto from 'crypto';

export const authService = {
  // USER REGISTER SERVICE
  registerUser: async (userData) => {
    const { name, email, password, role, phoneNumber } = userData;

    // Validate required fields:
    if (!name || !email || !password || !phoneNumber) {
      throw new ApiError('All fields are required', 400);
    }

    const existingUser = await AuthRepository.findUserByEmail(email);
    console.log(existingUser);
    if (existingUser) {
      throw new ApiError('User already exists with that email address', 400);
    }

    // Hash the password
    const hashedPassword = await encryptPassword(password);
    console.log('Password Hashed...');

    const newUser = await AuthRepository.createNewUser({
      name,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
    });

    // Generate verification OTP, hash it and persist the hash on user record
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    newUser.verificationToken = hashedOtp;
    newUser.verificationTokenExpires = expires;
    await newUser.save();

    // send the verification email with plaintext OTP (do not block registration failures silently)
    try {
      await emailService.sendVerificationEmail(newUser.email, otp);
    } catch (err) {
      console.warn('Failed to send verification email:', err.message || err);
    }

    // Setting password undefined so that the even hashed password wont be sent in response
    newUser.password = undefined;

    // We can use the concept of safe user by sending only the required data or make the password field undefined
    // const safeUser = {
    //   _id: newUser._id,
    //   name: newUser.name,
    //   email: newUser.email,
    //   role: newUser.role,
    // };

    return newUser;
  },

  // USER LOGIN SERVICE
  loginUser: async (loginCredentials) => {
    // Desctructure:

    const { email, password, role } = loginCredentials;

    if (!email || !password || !role) {
      throw new ApiError('All fields are required.', 400);
    }

    // Find the user
    let user = await AuthRepository.findUserByEmail(email);

    if (!user) {
      throw new ApiError(
        'Invalid credentials (either email or password is wrong!)',
        401
      );
    }

    // Check if the password entered matches that is in DB
    const isPasswordMatch = await decryptPassword(password, user.password);
    if (!isPasswordMatch) {
      throw new ApiError(
        'Invalid credentials(either email or password is wrong! pwd)',
        401
      );
    }

    // Require email verification before allowing login
    if (!user.isVerified) {
      throw new ApiError(
        'Email not verified. Please verify your email before logging in.',
        403
      );
    }

    // Setting password undefined so that the even hashed password wont be sent in response
    user.password = undefined;

    // Check role of the user
    if (role !== user.role) {
      throw new ApiError(`Account doesnot exists with ${role} role`, 404);
    }

    // TOKEN GENERATION
    const token = await generateToken({
      userId: user._id,
    });

    // toObject() strips Mongoose internals; pick only safe fields
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: !!user.isVerified,
    };

    return {
      user: safeUser,
      token,
    };
  },

  // Verify OTP code sent to email
  verifyEmail: async (email, token) => {
    if (!email || !token) {
      throw new ApiError('Email and token are required', 400);
    }

    const user = await AuthRepository.findUserByEmail(email);
    if (!user) throw new ApiError('Invalid email or token', 400);

    if (user.isVerified) {
      return { message: 'Email already verified' };
    }

    if (!user.verificationToken) {
      throw new ApiError('Invalid or expired token', 400);
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(String(token))
      .digest('hex');

    if (
      hashedToken !== user.verificationToken ||
      (user.verificationTokenExpires &&
        user.verificationTokenExpires < new Date())
    ) {
      throw new ApiError('Invalid or expired token', 400);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return { message: 'Email verified successfully' };
  },

  // Resend verification OTP to user's email
  resendVerification: async (email) => {
    if (!email) throw new ApiError('Email is required', 400);

    const user = await AuthRepository.findUserByEmail(email);
    if (!user) throw new ApiError('User not found', 404);

    if (user.isVerified) {
      return { message: 'Email already verified' };
    }

    // generate new OTP, hash it and persist
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    user.verificationToken = hashedOtp;
    user.verificationTokenExpires = expires;
    await user.save();

    try {
      await emailService.sendVerificationEmail(user.email, otp);
    } catch (err) {
      console.warn(
        'Failed to send verification email (resend):',
        err.message || err
      );
    }

    return { message: 'Verification code sent' };
  },
};
