import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const isAuthenticated = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        message: 'User not authenticated',
        success: false,
      });
    }

    //   Verify the token[ckecking if the payload is changed]
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    //   Check if the user exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return res.status(401).json({
        message: 'The user belonging to this token does not exists',
        success: false,
      });
    }

    // Later
    // Check if the user has changed the password after the token was token was issued

    req.user = currentUser;
    next();
  } catch (error) {
    console.log(error);
  }
};
