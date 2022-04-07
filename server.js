const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const express = require('express'); //
const app = express(); //
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const path = require('path');

app.use(express.json()); //
app.use('/uploads', express.static('uploads'));

// Connect DB
connectDB();

//routes
const auth = require('./routes/auth');
const carRoutes = require('./routes/carRoutes');
const private = require('./routes/private');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const typeRoutes = require('./routes/typeRoutes');
//api
app.use('/api/auth/', auth);
app.use('/api/private', private);
app.use('/api/private/car', carRoutes);
app.use('/api/private/booking', bookingRoutes);
app.use('/api/private/user', userRoutes);
app.use('/api/private/category', categoryRoutes);
app.use('/api/private/type', typeRoutes);

//DEPLOYMENT

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Error Handler (sort last of middlewares)
app.use(errorHandler);

const PORT = process.env.PORT || 5000; //

const server = app.listen(PORT, () => console.log(`Server running on ${PORT} port!`)); //

process.on('unhandledRejection', (err, promise) => {
  console.log(`Logged error: ${err}`);
  server.close(() => process.exit(1));
});
