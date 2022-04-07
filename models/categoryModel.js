const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    categoryImage: { type: String },
    desc: { type: String },
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
