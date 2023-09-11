const asyncHandler = require('express-async-handler');
const {Comment , validateCreateComment, validateUpdateComment}= require('../Models/Comments');
const { Post } = require('../Models/Post');
const { User } = require('../Models/User');

/**----------------------------------------
 * @desc   Create New Comment
 * @route /api/comments
 * @method POST
 * @access private (only logged in user can create comment)
/**---------------------------------------- */

module.exports.createCommentCtrl = asyncHandler(async (req, res) => {
    const { error } = validateCreateComment(req.body);

    if(error) {

        return res.status(400).json({success: false, message: error.details[0].message});
    }

    const profile = await User.findById(req.user.id);

    const comment = await Comment.create({

        postId : req.body.postId,
        text : req.body.text,
        user : req.user.id,
        username : profile.username

    });

    res.status(201).json({success: true, message: 'Comment Created Successfully', comment});
});

/**----------------------------------------
 * @desc   Get All Comments
 * @route /api/comments
 * @method GET
 * @access private (only Admin can get all comments)
/**---------------------------------------- */

module.exports.getAllCommentsCtrl = asyncHandler(async (req, res) => {
    
    const comments = await Comment.find().populate('user', 'username profilePhoto').populate('postId', 'title');

    res.status(200).json({message: 'All Comments', comments});
});



/**----------------------------------------
 * @desc   Delete Comment
 * @route /api/comments/:id
 * @method DElETE
 * @access private (only admin or owner of the comment)
/**---------------------------------------- */

module.exports.deleteCommentCtrl = asyncHandler(async (req, res) => {
    
     const comment = await Comment.findById(req.params.id);

     if(!comment) {

        return res.status(404).json({success: false, message: 'Comment Not Found'});
     }

     if(req.user.isAdmin || req.user.id === comment.user.toString()) {

        await Comment.findByIdAndDelete(req.params.id);

        return res.status(200).json({message: 'Comment Deleted Successfully'});
     }
     else {

        
        return res.status(403).json({message: 'You are not allowed to delete this comment'});
     }
});


/**----------------------------------------
 * @desc   Update Comment
 * @route /api/comments/:id
 * @method PUT
 * @access private (only owner of the comment)
/**---------------------------------------- */

module.exports.updateCommentCtrl = asyncHandler(async (req, res) => {
    
    // validation

    const { error } = validateUpdateComment(req.body);

    if(error) {

        return res.status(400).json({success: false, message: error.details[0].message});
    }

 
    const comment = await Comment.findById(req.params.id);

    if(!comment) {

        return res.status(404).json({message: 'Comment Not Found'});
    }

    // Authorization

    if(req.user.id !== comment.user.toString()) {
        res.status(403).json({message: 'You are not allowed to update this comment , only owner of the comment can update it'});
    }
    
    // update comment
    
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id,{
        text: req.body.text
    } , {new: true});

    res.status(200).json({message: 'Comment Updated Successfully', updatedComment});
});