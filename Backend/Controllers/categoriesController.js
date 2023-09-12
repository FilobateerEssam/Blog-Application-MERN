const asyncHandler = require("express-async-handler");
const { Category, validateCreateCategory } = require("../Models/Category");

const { Post } = require("../Models/Post");
const { User } = require("../Models/User");
const e = require("express");

/**----------------------------------------
 * @desc   Create New Category
 * @route /api/categories
 * @method POST
 * @access private (only Admin can create category)
/**---------------------------------------- */

module.exports.createCategoryCtrl = asyncHandler(async (req, res) => {
  // validation

  const { error } = validateCreateCategory(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const category = await Category.create({
    title: req.body.title,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Category Created Successfully",
    category,
  });
});

/**----------------------------------------
 * @desc   Get All Category
 * @route /api/categories
 * @method GET
 * @access public
/**---------------------------------------- */

module.exports.getAllCategoryCtrl = asyncHandler(async (req, res) => {
 
  
  const categories = await Category.find().sort({ createdAt: -1 }); // sort by createdAt desc new to old ;;

  res.status(200).json({ message: "All Categories", categories });
});

/**----------------------------------------
 * @desc   delete Category
 * @route /api/categories/:id
 * @method DELETE
 * @access private (only Admin can delete category)
/**---------------------------------------- */

module.exports.deleteCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category Not Found" });
  }

  await Category.findByIdAndDelete(req.params.id);

  res
    .status(200)
    .json({
      message: "Category Deleted Successfully",
      categoryId: category._id,
    });
    
});
