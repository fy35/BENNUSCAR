const Car = require('../models/carModel');
const ErrorResponse = require('../utils/errorResponse');
const fs = require('fs');

exports.createCar = async (req, res, next) => {
  console.log(req.body);
  if (req.file !== undefined) {
    req.body.carImage = req.file.filename;
  }

  try {
    const newCar = new Car(req.body);
    await newCar.save();

    res.status(201).json({
      success: true,
      message: 'Car succesfully created',
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 500));
  }
};

exports.updateCar = async (req, res, next) => {
  const carId = req.params.carId;

  if (req.file !== undefined) {
    req.body.carImage = req.file.filename;
  }
  const oldCar = await Car.findByIdAndUpdate(carId, req.body);

  await oldCar.save();

  if (
    req.file !== undefined &&
    req.file.filename !== oldCar.carImage &&
    (oldCar.carImage !== undefined || oldCar.carImage !== null) &&
    oldCar.carImage
  ) {
    fs.unlink(`uploads/cars/${oldCar.carImage}`, (err) => {
      if (err) return console.log('Cannot find file to unlink', err);
      console.log('Image succesfully deleted from filesystem:', oldCar.carImage);
    });
  }
  res.status(201).json({
    success: true,
    message: 'Car succesfully updated',
  });
};

exports.deleteCar = async (req, res, next) => {
  const carId = req.params.carId;

  const car = await Car.findById(carId);

  if (car.carImage) {
    fs.unlink(`uploads/cars/${car.carImage}`, (err) => {
      if (err) return console.log('Cannot find file to unlink', err);
      console.log('Image succesfully deleted from filesystem:', car.carImage);
    });
  }

  await Car.findByIdAndDelete(carId);

  res.status(201).json({
    success: true,
    message: 'Category succesfully deleted',
  });
};

exports.getNewCars = async (req, res, next) => {
  const newBy = req.query.new;

  try {
    const cars = newBy && (await Car.find().sort({ createdAt: 'desc' }).limit(6));

    const total = await Car.countDocuments({});
    sendToken(cars, 201, res);
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};

exports.getAllCars = async (req, res, next) => {
  const sortBy = req.query.sort ? req.query.sort : 'desc';
  const skipBy = req.query.skip ? parseInt(req.query.skip) : parseInt(1);
  const limitBy = req.query.limit ? parseInt(req.query.limit) : parseInt(10);

  try {
    const cars = await Car.find()
      .sort({ createdAt: sortBy })
      .skip((skipBy - 1) * limitBy)
      .limit(limitBy);

    const total = await Car.countDocuments({});
    sendToken({ cars, total }, 201, res);
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};

exports.getCar = async (req, res, next) => {
  try {
    const carId = req.params.carId;
    const car = await Car.findById(carId);
    sendToken(car, 201, res);
  } catch (err) {
    return next(new ErrorResponse('Invalid token', 500));
  }
};

const sendToken = (data, statusCode, res) => {
  res.status(statusCode).json({ success: true, data });
};
