const crypto = require('crypto');
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res, next) => {
  const { fullname, username, email, password } = req.body;

  try {
    const user = await User.create({
      fullname,
      username,
      email,
      password,
    });
    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new ErrorResponse('Please provide an username and password', 400));
  }
  try {
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse('Email could not be sent', 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;

    const message = `
    <h1> Dear ${user.fullname} You have requested a new password reset </h1>
    <p>Please go to the link to reset your password </p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `;

    try {
      await sendEmail({ to: user.email, subject: 'Password Reset Request', text: message });
      res.status(200).json({ success: true, data: 'Email Sent, please check spam,' });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return next(new ErrorResponse('Email could not be sent', 500));
    }
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse('Invalid reset token', 400));
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: 'Password Reset Success',
    });
  } catch (error) {
    next(error);
  }
};

//func
const sendToken = (user, statusCode, res) => {
  const { username, email, image } = user._doc;
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token, user: { username, email, image } });
};
