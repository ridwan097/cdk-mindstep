import mongoose from 'mongoose';
let server = process.env.MONGO_URI || '';
if (mongoose.STATES[mongoose.connection.readyState] !== 'connected') {
  mongoose.connect(server);
  mongoose.set('runValidators', true);
}

export default mongoose;
