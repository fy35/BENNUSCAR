const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: [true, 'Please provide a name'] },
    username: { type: String, required: [true, 'Please provide an username'], unique: true },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    image: {
      type: String,
    },
    bio: {
      type: String,
      required: true,
      default: 'Enter a description about you',
    },
    address: { type: String, required: true, default: 'Enter a valid adress' },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    role: { type: Number, default: 0 },
  },
  { timestamps: true }
);

//password salt for register
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//password match for login
UserSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//token for auth
UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

//token for reset password token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(35).toString('hex');

  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

  return resetToken;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
