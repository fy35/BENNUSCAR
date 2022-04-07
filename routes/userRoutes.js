const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');

const { protect } = require('../middleware/auth');
const { getUserData, updateProfile, updatePassword } = require('../controllers/userControllers');

router.route('/').get(protect, getUserData);
router.route('/updateprofile').put(protect, upload.single('image'), updateProfile);
router.route('/updatepassword').put(protect, updatePassword);

module.exports = router;
