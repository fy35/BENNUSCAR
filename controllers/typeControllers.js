const Type = require('../models/typeModel');
const ErrorResponse = require('../utils/errorResponse');
const fs = require('fs');

exports.createType = async (req, res, next) => {
  if (req.file !== undefined) {
    req.body.typeImage = req.file.filename;
  }

  try {
    const newType = new Type(req.body);
    await newType.save();

    res.status(201).json({
      success: true,
      message: 'Type succesfully created',
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 500));
  }
};

exports.updateType = async (req, res, next) => {
  const typeId = req.params.typeId;

  if (req.file !== undefined) {
    req.body.typeImage = req.file.filename;
  }
  const oldType = await Type.findByIdAndUpdate(typeId, req.body);

  await oldType.save();

  if (
    req.file !== undefined &&
    req.file.filename !== oldType.typeImage &&
    (oldType.typeImage !== undefined || oldType.typeImage !== null) &&
    oldType.typeImage
  ) {
    fs.unlink(`uploads/types/${oldType.typeImage}`, (err) => {
      if (err) return console.log('Cannot find file to unlink', err);
      console.log('Image succesfully deleted from filesystem:', oldType.typeImage);
    });
  }
  res.status(201).json({
    success: true,
    message: 'Type succesfully updated',
  });
};

exports.deleteType = async (req, res, next) => {
  const typeId = req.params.typeId;

  const type = await Type.findById(typeId);

  if (type.typeImage) {
    fs.unlink(`uploads/types/${type.typeImage}`, (err) => {
      if (err) return console.log('Cannot find file to unlink', err);
      console.log('Image succesfully deleted from filesystem:', type.typeImage);
    });
  }

  await Type.findByIdAndDelete(typeId);

  res.status(201).json({
    success: true,
    message: 'Type succesfully deleted',
  });
};

exports.getAllTypes = async (req, res, next) => {
  const sortBy = req.query.sort ? req.query.sort : 'desc';
  const skipBy = req.query.skip ? parseInt(req.query.skip) : parseInt(1);
  const limitBy = req.query.limit ? parseInt(req.query.limit) : parseInt(10);

  try {
    const types = await Type.find()
      .sort({ createdAt: sortBy })
      .skip((skipBy - 1) * limitBy)
      .limit(limitBy);

    const total = await Type.countDocuments({});
    sendToken({ types, total }, 201, res);
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};

const sendToken = (data, statusCode, res) => {
  res.status(statusCode).json({ success: true, data });
};
