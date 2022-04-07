const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { protect, protectAdmin } = require('../middleware/auth');

const { createType, updateType, deleteType } = require('../controllers/typeControllers');
const { getAllTypes } = require('../controllers/typeControllers');

//admin create type
router.route('/create').post(protectAdmin, upload.single('typeImage'), createType);

//admin update type
router.route('/update/:typeId').put(protectAdmin, upload.single('typeImage'), updateType);

//admin delete type
router.route('/delete/:typeId').delete(protectAdmin, deleteType);

//user get types
router.route('/gettypes').get(protect, getAllTypes);

module.exports = router;
