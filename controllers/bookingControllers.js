const Booking = require('../models/bookingModel');
const Car = require('../models/carModel');
const ErrorResponse = require('../utils/errorResponse');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');

exports.setBooking = async (req, res, next) => {
  const { token } = req.body;
  // const { role, address, bio, image, ...others } = req.user._doc;
  // req.body.user = others;

  req.body.user = req.user._id;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: req.body.totalAmount * 100,
        currency: 'TRY',
        customer: customer.id,
        receipt_email: customer.email,
        description: `${req.body.carName}, ${req.body.carVIN} numaralı araba, ${req.user.fullname}(${req.user.username}) adlı üye tarafından, ${req.body.bookedTimeSlots.from}'tarihinden ${req.body.bookedTimeSlots.to} tarihine kadar kiralanmıştır.`,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      req.body.transactionId = payment.source.id;

      req.body.customer = {
        name: payment.source.name,
        address: payment.source.address_line1,
        email: payment.receipt_email,
      };

      req.body.description = payment.description;
      req.body.receipt = payment.receipt_url;

      const newBooking = new Booking(req.body);
      await newBooking.save();

      //push booked time to car
      const car = await Car.findOne({ _id: req.body.car });
      car.bookedTimeSlots.push(req.body.bookedTimeSlots);
      await car.save();

      sendToken((data = { newBooking, message: 'Your Booking Success' }), 201, res);
    } else {
      return next(new ErrorResponse('Try again', 404));
    }
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};

exports.getUserBookings = async (req, res, next) => {
  const sortBy = req.query.sort ? req.query.sort : 'desc';
  const skipBy = req.query.skip ? parseInt(req.query.skip) : parseInt(1);
  const limitBy = req.query.limit ? parseInt(req.query.limit) : parseInt(3);

  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('car')
      .populate('user')
      .sort({ createdAt: sortBy })
      .skip((skipBy - 1) * limitBy)
      .limit(limitBy);

    const total = await Booking.countDocuments({ user: req.user._id });
    sendToken({ bookings, total }, 201, res);
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};

const sendToken = (data, statusCode, res) => {
  res.status(statusCode).json({ success: true, data });
};
