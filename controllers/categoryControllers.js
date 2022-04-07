const Category = require('../models/categoryModel');
const ErrorResponse = require('../utils/errorResponse');
const fs = require('fs');

exports.createCategory = async (req, res, next) => {
  if (req.file !== undefined) {
    req.body.categoryImage = req.file.filename;
  }

  try {
    const newCategory = new Category(req.body);
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: 'Category succesfully created',
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 500));
  }
};

exports.updateCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;

  if (req.file !== undefined) {
    req.body.categoryImage = req.file.filename;
  }
  const oldCategory = await Category.findByIdAndUpdate(categoryId, req.body);

  await oldCategory.save();

  if (
    req.file !== undefined &&
    req.file.filename !== oldCategory.categoryImage &&
    (oldCategory.categoryImage !== undefined || oldCategory.categoryImage !== null) &&
    oldCategory.categoryImage
  ) {
    fs.unlink(`uploads/categories/${oldCategory.categoryImage}`, (err) => {
      if (err) return console.log('Cannot find file to unlink', err);
      console.log('Image succesfully deleted from filesystem:', oldCategory.categoryImage);
    });
  }
  res.status(201).json({
    success: true,
    message: 'Categor succesfully updated',
  });
};

exports.deleteCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;

  const category = await Category.findById(categoryId);

  if (category.categoryImage) {
    fs.unlink(`uploads/categories/${category.categoryImage}`, (err) => {
      if (err) return console.log('Cannot find file to unlink', err);
      console.log('Image succesfully deleted from filesystem:', category.categoryImage);
    });
  }

  await Category.findByIdAndDelete(categoryId);

  res.status(201).json({
    success: true,
    message: 'Category succesfully deleted',
  });
};

exports.getAllCategories = async (req, res, next) => {
  const sortBy = req.query.sort ? req.query.sort : 'desc';
  const skipBy = req.query.skip ? parseInt(req.query.skip) : parseInt(1);
  const limitBy = req.query.limit ? parseInt(req.query.limit) : parseInt(10);

  try {
    const categories = await Category.find()
      .sort({ createdAt: sortBy })
      .skip((skipBy - 1) * limitBy)
      .limit(limitBy);

    const total = await Category.countDocuments({});
    sendToken({ categories, total }, 201, res);
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};

const sendToken = (data, statusCode, res) => {
  res.status(statusCode).json({ success: true, data });
};
