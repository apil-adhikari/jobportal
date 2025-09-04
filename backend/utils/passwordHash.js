import bcrypt from 'bcryptjs';

export const encryptPassword = async (plainPassword) =>
  await bcrypt.hash(plainPassword, 12);

export const decryptPassword = async (plainPassword, encryptedPassword) =>
  await bcrypt.compare(plainPassword, encryptedPassword);
