import User from '../models/user.model.js';

export const AuthRepository = {
  findUserByEmail: async (email) => {
    // Model.find() gives the data in an array format so we cant test it for null or undefined value. So to get a single document, we need to use findOne method
    const user = await User.findOne({ email }).select('+password +isVerified');
    return user;
  },

  createNewUser: async (userData) => await User.create(userData),
};
