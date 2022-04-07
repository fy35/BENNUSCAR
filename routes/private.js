const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/auth');
const upload = require('../middleware/multer');

//for admins
const { getAdminData } = require('../controllers/private');
//for admins-user
const { getAllUsers, updateUser, deleteUser } = require('../controllers/private');
//for admins-bookings
const { getAllBookings } = require('../controllers/private');
//for admins-stats
const { rUBLY, tBBLY, bFEU, bCFAU, sOEC, cOEC } = require('../controllers/private');

//for admins
router.route('/admin/').get(protectAdmin, getAdminData);

//for admins-user
router.route('/admin/users').get(protectAdmin, getAllUsers);
router.route('/admin/users/:userId').put(protectAdmin, upload.single('image'), updateUser);
router
  .route('/admin/users/delete/:userId')
  .delete(protectAdmin, upload.single('image'), deleteUser);

//for admins-bookings
router.route('/admin/bookings').get(protectAdmin, getAllBookings);

//for admin-stats
router.route('/admin/userstats/rubly').get(protectAdmin, rUBLY);
router.route('/admin/userstats/tbbly').get(protectAdmin, tBBLY);
router.route('/admin/userstats/bfeu').get(protectAdmin, bFEU);
router.route('/admin/userstats/bcfau').get(protectAdmin, bCFAU);
router.route('/admin/userstats/soec').get(protectAdmin, sOEC);
router.route('/admin/userstats/coec').get(protectAdmin, cOEC);

module.exports = router;
