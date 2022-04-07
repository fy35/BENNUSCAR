const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.connect(`${process.env.MONGO_URL}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log('Database connection success!');
  } catch (error) {
    console.log('Database connection failure', error);
  }
};

module.exports = connectDB;
