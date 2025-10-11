// THIS UTILITY FUNCTION IS USED TO GENERATE TOKEN

import jwt from 'jsonwebtoken';

export const generateToken = async (tokenData) =>
  jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
    expiresIn: '1d', // token expires in 1 day
  });
