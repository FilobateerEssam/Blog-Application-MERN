const mongoose = require('mongoose');
const joi = require('joi'); // for validation


// Comment Schema

const CommentSchema = new mongoose.Schema({
    
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    text: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
    },

}, { timestamps: true });


// Comment Model

const Comment = mongoose.model('Comment', CommentSchema);

// Validation

// Create Comment Validation

function validateCreateComment(obj) {
    const schema = joi.object({
        postId: joi.string().required().label('Post Id'),
        text: joi.string().trim().required(),
        
    });
    return schema.validate(obj);
}


// Update Comment Validation

function validateUpdateComment(obj) {
    const schema = joi.object({
        text: joi.string().trim().required(),
        
    });
    return schema.validate(obj);
}


module.exports= {Comment, validateCreateComment, validateUpdateComment};