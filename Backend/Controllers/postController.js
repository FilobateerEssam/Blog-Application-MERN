const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const {
  Post,
  validateCreatePost,
  validateUpdatePost,
} = require("../Models/Post");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");

/**----------------------------------------
 * @desc   Create New Post
 * @route /api/posts
 * @method Post
 * @access private (only LoggedIn User)
/**---------------------------------------- */

module.exports.createPostCtrl = asyncHandler(async (req, res) => {
  // 1. Validation for image

  if (!req.file) {
    return res.status(400).json({ message: "Please Upload Image" });
  }

  // 2. validation for data

  const { error } = validateCreatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // 3. Upload Photo

  // - we need to save image into folder Images

  const imagePath = path.join(__dirname, "../Images/", req.file.filename);
  // - we need to save image into cloudinary

  const result = await cloudinaryUploadImage(imagePath);

  // 4. Create a new Post and save it to db

  // - there are two ways to save image in db
  // 1. new post and then await post.save()

  // const post1 = new Post({
  //     title : req.body.title,
  // });
  // await post1.save();

  // 2. Post.create() we can create and save in one line

  const post = await Post.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    user: req.user.id,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });
  // 5. send the response to client

  res.status(201).json({ message: "Post Created", post }); // 201 means created

  // 6. remove the image from server which in images folder
  fs.unlinkSync(imagePath);
});

/**----------------------------------------
 * @desc   Get All Posts
 * @route /api/posts
 * @method GET
 * @access public
/**---------------------------------------- */

module.exports.getAllPostsCtrl = asyncHandler(async (req, res) => {
  // -------------- pagination --------------
  // post in each page

  const POST_PER_PAGE = 3;

  const { pageNumber, category } = req.query;

  let posts;

  // move depend on page number

  if (pageNumber) {
    // give to user post depend on page number

    posts = await Post.find()
      .skip((pageNumber - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE)
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  }

  // move depend on category
  else if (category) {
    posts = await Post.find({ category })
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else {
    posts = await Post.find()
      .sort({ createdAt: -1 }) // sort by createdAt desc new to old ;
      .populate("user", ["-password"]); // include  all user data in post except password

    /** 
        .populate("user") // include  all user data in post
        .populate("user","username image") // include  all user data in post but show only username
        */
  }

  res.status(200).json({ posts });
});

/**----------------------------------------
 * @desc   Get single Post
 * @route /api/posts/:id
 * @method GET
 * @access public
/**---------------------------------------- */

module.exports.getSinglePostCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("user", [
    "-password",
  ]); // include  all user data in post except password

  if (!post) {
    return res.status(404).json({ message: "Post Not Found" });
  }

  res.status(200).json({ post });
});

/**----------------------------------------
 * @desc   Get Posts Count
 * @route /api/posts/count
 * @method GET
 * @access public
/**---------------------------------------- */

module.exports.getCountPostCtrl = asyncHandler(async (req, res) => {
  const count = await Post.count();

  res.status(200).json({ count });
});

/**----------------------------------------
 * @desc   Delete  Post
 * @route /api/posts/:id
 * @method Delete
 * @access private (only Admin or Owner of Post)
/**---------------------------------------- */

module.exports.deletePostCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post Not Found" });
  }

  // id of the url for the post not the owner of the post so we will made validation for admin or owner of the post

  // 1. check if the user is admin or owner of the post

  if (req.user.isAdmin || post.user.toString() === req.user.id.toString()) {
    // 2. delete the post from db
    await Post.findByIdAndDelete(req.params.id);

    // 3. delete the image from cloudinary

    await cloudinaryRemoveImage(post.image.publicId);

    //@TODO 4. Delete All comments of this post

    // 5. send the response to client

    res
      .status(200)
      .json({ message: "Post Deleted Successfully", postId: post._id });
  } else {
    return res
      .status(403)
      .json({ message: "You are not allowed to delete this post" });
  }
});

/**----------------------------------------
 * @desc   Update Post
 * @route /api/posts/:id
 * @method PUT
 * @access private (only owner of Post)
/**---------------------------------------- */

module.exports.updatePostCtrl = asyncHandler(async (req, res) => {
  // 1. Validation for data

  const { error } = validateUpdatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // 2.get the post fromd DB check if the post is exist

  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post Not Found" });
  }

  // 3. check if the user is owner of the post

  if (post.user.toString() !== req.user.id.toString()) {
    // 403 means forbidden
    return res
      .status(403)
      .json({ message: "You are not allowed to update this post" });
  }

  // 4. update the post

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      },
    },
    { new: true }
  ) // new : true means return the updated post not the old one
    .populate("user", ["-password"]);

  // 5. send the response to client

  res
    .status(200)
    .json({ message: "Post Updated Successfully", post: updatedPost });
});

/**----------------------------------------
 * @desc   Update Post Image
 * @route /api/posts/upload-image/:id
 * @method PUT
 * @access private (only owner of Post)
/**---------------------------------------- */

module.exports.updatePostImageCtrl = asyncHandler(async (req, res) => {
  // 1. Validation for image

  // req.file means the image that we upload it

  if (!req.file) {
    return res.status(400).json({ message: "Please Upload Image" });
  }

  // 2.get the post fromd DB check if the post is exist

  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post Not Found" });
  }

  // 3. check if the user is owner of the post

  if (post.user.toString() !== req.user.id.toString()) {
    // 403 means forbidden
    return res
      .status(403)
      .json({ message: "You are not allowed to update this post" });
  }

  // 4. update the post image

  // - delete the old image from cloudinary

  await cloudinaryRemoveImage(post.image.publicId);

  // - upload the new image to cloudinary

  const imagepath = path.join(__dirname, `../Images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagepath);

  // 5. update the post with new image in db
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        image: {
            url: result.secure_url,
            publicId: result.public_id,
        }
      },
    },
    { new: true }
  ); // new : true means return the updated post not the old one
     
  // 6. send the response to client

  res
    .status(200)
    .json({ message: "Post with Image Updated Successfully", post: updatedPost });

    // 7. remove the image from server which in images folder
    fs.unlinkSync(imagepath);
});



/**----------------------------------------
 * @desc   Toggle Like Post
 * @route /api/posts/like/:id
 * @method PUT
 * @access private (only logged in user)
/**---------------------------------------- */


module.exports.toggleLikePostCtrl = asyncHandler(async (req, res) => {

  const LoggedInUser = req.user.id;
  const {id: postId} = req.params;

  let post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post Not Found" });
  }

  // 1. check if the user is already liked the post

  const isPostAlreadyLiked = post.likes.find(
    (user) => user.toString() === LoggedInUser.toString());

    if(isPostAlreadyLiked){

      post = await Post.findByIdAndUpdate(postId, {

        // pull means remove from array likes , pull is a mongoose method works on array
        $pull: { likes: LoggedInUser },
      }, {new: true});

    }

    // 2. if the user is not liked the post

    else{

      post = await Post.findByIdAndUpdate(postId, {

        // push means add to array likes , push is a mongoose method works on array

        $push: { likes: LoggedInUser },
      }, {new: true});

      res.status(200).json({message: "Post Liked Successfully"});

    }
    res.status(200).json({post});

});