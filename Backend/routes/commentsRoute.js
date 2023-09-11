const router = require('express').Router();
const { createCommentCtrl, getAllCommentsCtrl, deleteCommentCtrl, updateCommentCtrl } = require('../Controllers/commentController');
const validateObjectid = require('../Middlewares/validateObjectid');
const { verifyToken, verifyTokenAdmin, verifyTokenAndAuthorization } = require('../Middlewares/verifyToken');



// /api/comments

router.route('/')
.post(verifyToken,createCommentCtrl)
.get(verifyTokenAdmin,getAllCommentsCtrl)

// /api/comments/:id

router.route('/:id')
.delete(validateObjectid,verifyToken,deleteCommentCtrl)
.put(validateObjectid,verifyToken,updateCommentCtrl)

module.exports = router;