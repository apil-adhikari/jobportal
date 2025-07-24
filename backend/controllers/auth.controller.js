import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber } = req.body;

    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({
        message: 'All fields are required',
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: 'User already exists with that email address',
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
    });

    user = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phoneNumber: newUser.phoneNumber,
      id: newUser._id,
    };

    res.status(201).json({
      message: 'User registered successfully',
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: 'All fields are required',
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'Incorrect email or password',
        success: false,
      });
    }

    const isPasswordMatch = bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: 'Invalid email or password',
        success: false,
      });
    }

    // Chekc role if correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: 'Account does not exist with current role',
        success: false,
      });
    }

    // Generate Token
    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: '1d',
    });

    user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };

    res
      .status(200)
      .cookie('token', token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
      })
      .json({
        message: `Welcome back ${user.name}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie('token', '', {
        maxAge: 0,
      })
      .json({
        message: 'Logged out successfully',
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};
