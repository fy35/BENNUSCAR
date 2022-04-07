const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse('No user found with this id', 404));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse('Please login and continue.', 401));
  }
};

exports.protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await User.findById(decoded.id);

    if (!admin) {
      return next(new ErrorResponse('No admin found with this id', 404));
    }
    if (admin.role !== 1) {
      return next(new ErrorResponse('GO BACK TOU YOUR WORK BRO', 401));
    }
    req.user = admin;
    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};
