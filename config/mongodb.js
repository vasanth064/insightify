import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const database = process.env.MONGODB_URI.replace(
  '<password>',
  process.env.MONGODB_PASSWORD
);

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    mongoose.connect(database, {
      useNewUrlParser: true,
    });
    console.log('MongoDB Connection Success');
  } catch (err) {
    console.error('MongoDB Connection Failed => ', err);
  }
};

export default connectDB;
