const router = require('express').Router();
const { createPostCtrl, getAllPostsCtrl, getSinglePostCtrl, getCountPostCtrl, deletePostCtrl, updatePostCtrl, updatePostImageCtrl, toggleLikePostCtrl } = require('../Controllers/postController');
const photoUpload = require('../Middlewares/photoUpload');

const {verifyToken} = require('../Middlewares/verifyToken')

const validateObjetId = require('../Middlewares/validateObjectid')

// /api/posts

router.route('/')
.post(verifyToken,photoUpload.single('image'),createPostCtrl)
.get(getAllPostsCtrl);


// /api/posts/count
router.route('/count').get(getCountPostCtrl)


// /api/posts/:id
router
.route('/:id')
.get(getSinglePostCtrl)
.delete(validateObjetId,verifyToken,deletePostCtrl)
.put(validateObjetId,verifyToken,updatePostCtrl)


// /api/posts/upload-image/:id

router.route('/upload-image/:id')
.put(validateObjetId,verifyToken,photoUpload.single('image'),updatePostImageCtrl)

// /api/posts/like/:id

router.route('/like/:id').put(validateObjetId,verifyToken,toggleLikePostCtrl)

module.exports = router;