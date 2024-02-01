import mongoose from 'mongoose';
import * as dotenv from 'dotenv';



dotenv.config();

const {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_NAME,
} = process.env;

const database = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_NAME}?authSource=admin`


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
