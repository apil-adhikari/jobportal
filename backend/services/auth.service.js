import { AuthRepository } from '../repositories/auth.repository.js';
import ApiError from '../utils/ApiError.js';
import { decryptPassword, encryptPassword } from '../utils/passwordHash.js';
import { generateToken } from '../utils/token.utils.js';

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
    };

    return {
      user: safeUser,
      token,
    };
  },
};
