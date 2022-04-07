const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const {
  createCar,
  updateCar,
  deleteCar,
  getNewCars,
  getAllCars,
  getCar,
} = require('../controllers/carControllers');
const { protect, protectAdmin } = require('../middleware/auth');

router.route('/create').post(protectAdmin, upload.single('carImage'), createCar);

router.route('/update/:carId').put(protectAdmin, upload.single('carImage'), updateCar);

//admin delete categories
router.route('/delete/:carId').delete(protectAdmin, deleteCar);

router.route('/find/:carId').get(protect, getCar);

router.route('/new').get(getNewCars);

router.route('/getcars').get(protect, getAllCars);

module.exports = router;
