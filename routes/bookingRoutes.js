const express = require('express');
const router = express.Router();
const { setBooking, getUserBookings } = require('../controllers/bookingControllers');
const { protect } = require('../middleware/auth');

router.route('/bookcar').post(protect, setBooking);
router.route('/getUserBookings').get(protect, getUserBookings);

module.exports = router;
