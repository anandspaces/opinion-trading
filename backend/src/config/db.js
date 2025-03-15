import { connect } from 'mongoose';
import { info, error as _error } from '../utils/logger';

const connectDB = async () => {
  try {
    await connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    info('MongoDB Connected');
  } catch (error) {
    _error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;