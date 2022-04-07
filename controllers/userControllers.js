const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');

const fs = require('fs');

exports.getUserData = async (req, res, next) => {
  const owner = req.headers.ownertype;

  if (owner === 'header') {
    const { fullname, email, image, role } = req.user;
    req.user = { fullname, email, image, role };
  }

  res.status(200).json({
    success: true,
    data: 'You got access to the private data at this route',
    user: req.user,
  });
};

exports.updateProfile = async (req, res, next) => {
  const userId = req.user._id;

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

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return next(new ErrorResponse('User not found', 400));
    }

    const isMatch = await user.matchPasswords(req.body.oldpassword);
    if (!isMatch) {
      return next(new ErrorResponse('Old password not correct!', 400));
    }
    if (req.body.newpassword !== req.body.newpassword2) {
      return next(new ErrorResponse('New passwords are not match!', 400));
    }

    user.password = req.body.newpassword;

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Password changed succesfully.',
    });
  } catch (error) {
    next(error);
  }
};
