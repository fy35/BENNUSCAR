const mongoose = require('mongoose');

const TypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    typeImage: { type: String },
    desc: { type: String },
  },
  { timestamps: true }
);

const Type = mongoose.model('Type', TypeSchema);

module.exports = Type;
