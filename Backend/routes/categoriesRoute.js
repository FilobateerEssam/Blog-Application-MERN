const router = require('express').Router();

const { createCategoryCtrl, getAllCategoryCtrl, deleteCategoryCtrl } = require('../Controllers/categoriesController');
const {verifyToken , verifyTokenAdmin } = require('../Middlewares/verifyToken')
const validateObjectid = require('../Middlewares/validateObjectid');
// /api/categories

router.route('/')

    .post(verifyTokenAdmin , createCategoryCtrl)
    .get(verifyToken , getAllCategoryCtrl);

// /api/categories/:id

router.route('/:id').delete(validateObjectid,verifyTokenAdmin,deleteCategoryCtrl);

module.exports = router;