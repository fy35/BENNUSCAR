const User = require('../models/userModel');
const Car = require('../models/carModel');
const Booking = require('../models/bookingModel');
const ErrorResponse = require('../utils/errorResponse');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const fs = require('fs');

//admin
exports.getAdminData = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: 'You got access to the private admin data at this route',
  });
};

//admin--user
exports.getAllUsers = async (req, res, next) => {
  const newBy = req.query.new;
  const sortBy = req.query.sort ? req.query.sort : 'desc';
  const skipBy = req.query.skip ? parseInt(req.query.skip) : parseInt(1);
  const limitBy = req.query.limit ? parseInt(req.query.limit) : parseInt(10);

  try {
    const users = newBy
      ? await User.find().sort({ createdAt: 'desc' }).limit(7)
      : await User.find()
          .sort({ createdAt: sortBy })
          .skip((skipBy - 1) * limitBy)
          .limit(limitBy);
    const total = await User.countDocuments({});
    sendToken({ users, total }, 201, res);
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};

exports.updateUser = async (req, res, next) => {
  const userId = req.params.userId;

  if (req.file !== undefined) {
    req.body.image = req.file.filename;
  }

  const oldProfile = await User.findByIdAndUpdate(userId, req.body);

  await oldProfile.save();

  if (req.file !== undefined && req.file.filename !== oldProfile.image && oldProfile.image) {
    fs.unlink(`uploads/profiles/${oldProfile.image}`, (err) => {
      if (err) return console.log('Cannot find file to unlink', err);
      console.log('Image succesfully deleted from filesystem:', oldProfile.image);
    });
  }
  res.status(201).json({
    success: true,
    message: 'Profile succesfully updated',
  });
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);

  if (user.image) {
    fs.unlink(`uploads/profiles/${user.image}`, (err) => {
      if (err) return console.log('Cannot find file to unlink', err);
      console.log('Image succesfully deleted from filesystem:', user.image);
    });
  }

  await User.findByIdAndDelete(userId);

  res.status(201).json({
    success: true,
    message: 'Account succesfully deleted',
  });
};

exports.createCar = async (req, res, next) => {
  try {
    const newCar = new Car(req.body);
    await newCar.save();

    sendToken((data = { newCar, message: 'New Car succesfully added' }), 201, res);
  } catch (error) {
    return next(new ErrorResponse(error.message, 500));
  }
};

//admin--user-stats

//registeredusersbylastyear --
exports.rUBLY = async (req, res, next) => {
  const after = req.query.after;

  try {
    const registeredUserByLastYear = await User.aggregate([
      { $match: { createdAt: { $gte: dayAfter(after) } } },
      { $project: { month: { $month: '$createdAt' } } },
      { $group: { _id: '$month', total: { $sum: 1 } } },
    ]).sort({ _id: 1 });

    sendToken(registeredUserByLastYear, 200, res);
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
};

//totalcarbookings--
exports.tBBLY = async (req, res, next) => {
  const after = req.query.after;
  const carId = req.query.carid;

  try {
    //this years montly registered user sorted by id
    const totalBookingsByLastYear = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: dayAfter(after) },
          ...(carId && { car: ObjectId(carId) }),
        },
      },
      {
        $project: {
          month: { $month: '$createdAt' },
          totalAmount: '$totalAmount',
          totalDays: '$totalDays',
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          totalDays: { $sum: '$totalDays' },
        },
      },
    ]).sort({ _id: 1 });

    sendToken(totalBookingsByLastYear, 200, res);
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
};

//totalBookingsForEachUser
exports.bFEU = async (req, res, next) => {
  const after = req.query.after;

  try {
    //all time booking of each user sorted by amount
    const bookingsForEachUser = await Booking.aggregate([
      { $match: { createdAt: { $gte: dayAfter(after) } } },
      { $group: { _id: '$user', total: { $sum: '$totalAmount' } } },
    ]).sort({ total: -1 });

    sendToken(bookingsForEachUser, 200, res);
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
};

//bookedCarsForAUser
exports.bCFAU = async (req, res, next) => {
  const after = req.query.after;

  try {
    const bookedCarsForAUser = await Booking.aggregate([
      { $match: { user: ObjectId(req.body.userId), createdAt: { $gte: dayAfter(after) } } },
      { $lookup: { from: 'cars', localField: 'car', foreignField: '_id', as: 'cars' } },
      {
        $group: {
          _id: '$car',
          car: {
            $first: {
              _id: { $first: '$cars._id' },
              name: { $first: '$cars.name' },
              carVIN: { $first: '$cars.carVIN' },
              image: { $first: '$cars.image' },
            },
          },
          totalAmount: { $sum: '$totalAmount' },
        },
      },
    ]).sort({ totalAmount: -1 });

    sendToken(bookedCarsForAUser, 200, res);
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
};

//salesOfEachCar
exports.sOEC = async (req, res, next) => {
  const after = req.query.after;

  try {
    //this years sales of each car sorted by amount{
    const salesOfEachCar = await Booking.aggregate([
      { $match: { createdAt: { $gte: dayAfter(after) } } },
      { $group: { _id: '$car', total: { $sum: '$totalAmount' } } },
    ]).sort({ total: -1 });

    sendToken(salesOfEachCar, 200, res);
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
};

//costOfEachCar

exports.cOEC = async (req, res, next) => {
  const after = req.query.after;

  try {
    const costOfCarByDay = await Car.aggregate([
      { $match: { createdAt: { $gte: dayAfter(after) } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: '$monthlyCost' },
        },
      },
      {
        $group: {
          _id: null,
          array: { $push: '$$ROOT' },
        },
      },
      {
        $addFields: {
          array: {
            $map: {
              input: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
              as: 'month',
              in: {
                $cond: {
                  if: { $in: ['$$month', '$array._id'] },
                  then: {
                    $arrayElemAt: ['$array', { $indexOfArray: ['$array._id', '$$month'] }],
                  },
                  else: {
                    _id: '$$month',
                    count: 0,
                  },
                },
              },
            },
          },
        },
      },
      { $unwind: '$array' },
      {
        $sort: { 'array._id': 1 },
      },
      {
        $project: {
          _id: 0,
          count: '$array.count',
          month: '$array._id',
        },
      },
      {
        $setWindowFields: {
          sortBy: { _id: 1 },
          output: {
            cumulative: {
              $sum: '$count',
              window: { documents: ['unbounded', 'current'] },
            },
          },
        },
      },
    ]).sort({ _id: 1 });

    sendToken(costOfCarByDay, 200, res);
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
};

//admin--bookings
exports.getAllBookings = async (req, res, next) => {
  const newBy = req.query.new;
  const sortBy = req.query.sort ? req.query.sort : 'desc';
  const skipBy = req.query.skip ? parseInt(req.query.skip) : parseInt(1);
  const limitBy = req.query.limit ? parseInt(req.query.limit) : parseInt(10);

  try {
    const bookings = newBy
      ? await Booking.find().sort({ createdAt: 'desc' }).limit(5).populate('car').populate('user')
      : await Booking.find()
          .sort({ createdAt: sortBy })
          .skip((skipBy - 1) * limitBy)
          .limit(limitBy)
          .populate('car')
          .populate('user');
    const total = await Booking.countDocuments({});
    sendToken({ bookings, total }, 201, res);
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};

const sendToken = (data, statusCode, res) => {
  res.status(statusCode).json({ success: true, data });
};

const dayAfter = (after) => {
  const date = new Date();

  const lastThirtyDays = new Date(new Date().setDate(date.getDate() - 30));
  const lastSixtyDays = new Date(new Date().setDate(date.getDate() - 60));

  const lastMonth = new Date(new Date().setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  const lastYear = new Date(new Date().setFullYear(date.getFullYear() - 1));
  const lastFiveYear = new Date(new Date().setFullYear(date.getFullYear() - 5));
  const lastTenYear = new Date(new Date().setFullYear(date.getFullYear() - 10));
  const lastInfiniteYear = new Date(new Date().setFullYear(date.getFullYear() - 99));

  let query;
  if (
    !after ||
    (after !== 'tenyear' &&
      after !== 'fiveyear' &&
      after !== 'year' &&
      after !== 'prevmonth' &&
      after !== 'month' &&
      after !== 'sixty' &&
      after !== 'thirty')
  ) {
    query = lastInfiniteYear;
  } else if (after === 'tenyear') {
    query = lastTenYear;
  } else if (after === 'fiveyear') {
    query = lastFiveYear;
  } else if (after === 'year') {
    query = lastYear;
  } else if (after === 'prevmonth') {
    query = previousMonth;
  } else if (after === 'month') {
    query = lastMonth;
  } else if (after === 'sixty') {
    query = lastSixtyDays;
  } else if (after === 'thirty') {
    query = lastThirtyDays;
  }
  return query;
};
