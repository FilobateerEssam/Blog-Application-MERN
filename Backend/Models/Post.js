const mongoose = require("mongoose");
const joi = require("joi"); // for validation
const jwt = require("jsonwebtoken"); // for token

// Post Schema

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },

    // Relation between Post and User
    user: {
      // will be Object from User Model
      type: mongoose.Schema.Types.ObjectId,

      ref: "User", // refrence to User Model include image , name , email
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },
    likes: [
      {
        // will be Object from User Model user who like this post
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, // CreatedAt , UpdatedAt
    toJSON: { virtuals: true }, // to include virtuals
    toObject: { virtuals: true }, // to include virtuals
  }
);

// populate Comment for this Post

                      // can be any name but use that name in populate
PostSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "postId",
  localField: "_id",


});

// Post Model

const Post = mongoose.model("Post", PostSchema);

// Validation create Post

function validateCreatePost(obj) {
  const schema = joi.object({
    title: joi.string().trim().min(3).max(200).required(),
    description: joi.string().trim().min(10).required(),
    category: joi.string().trim().required(),
  });
  return schema.validate(obj);
}

// Validation Update Post

function validateUpdatePost(obj) {
  const schema = joi.object({
    title: joi.string().trim().min(3).max(200),
    description: joi.string().trim().min(10),
    category: joi.string().trim(),
  });
  return schema.validate(obj);
}

module.exports = { validateCreatePost, validateUpdatePost, Post };
