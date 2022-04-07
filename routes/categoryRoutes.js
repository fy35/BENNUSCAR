const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { protect, protectAdmin } = require('../middleware/auth');
const {
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryControllers');
const { getAllCategories } = require('../controllers/categoryControllers');

//admin create categories
router.route('/create').post(protectAdmin, upload.single('categoryImage'), createCategory);

//admin update categories
router
  .route('/update/:categoryId')
  .put(protectAdmin, upload.single('categoryImage'), updateCategory);

//admin delete categories
router.route('/delete/:categoryId').delete(protectAdmin, deleteCategory);

//user get categories
router.route('/getcategories').get(protect, getAllCategories);

module.exports = router;
