const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'image') {
      cb(null, 'uploads/profiles');
    } else if (file.fieldname === 'typeImage') {
      cb(null, 'uploads/types');
    } else if (file.fieldname === 'categoryImage') {
      cb(null, 'uploads/categories');
    } else if (file.fieldname === 'carImage') {
      cb(null, 'uploads/cars');
    } else {
      cb(null, 'uploads/others');
    }
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload;
