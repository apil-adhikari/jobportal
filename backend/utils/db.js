import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connectionString = process.env.MONGO_URI.replace(
      '<DB_PASSWORD>',
      process.env.MONGO_PASSWORD
    );
    await mongoose.connect(connectionString);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
