const mongoose = require("mongoose");
const joi = require("joi"); // for validation
const jwt = require("jsonwebtoken"); // for token

// User Schema

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
        publicid: null,
      },
    },
    bio: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    // posts: [] that will be added later when the user create post , will be shown if needed
  },
  {
    timestamps: true, // CreatedAt , UpdatedAt
    toJSON: { virtuals: true }, // to show virtuals
    toObject: { virtuals: true }, // to show virtuals
  }
);

// Populate Posts That Belongs To This User When he/she Get his/her Profile (Relation) 
UserSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'user', // user field in Post Model
  localField: '_id', // id for this user
})


// token is Generated before model and after schema
// token have 3 parts header , payload , signature
// header : algorithm and type
// payload : data
// signature : secret key

// token here have id and isAdmin
UserSchema.methods.generateAuthToken = function(){

                    // this is the user object from schema
  return jwt.sign({id: this._id, isAdmin: this.isAdmin}, process.env.JWT_SECRET);
}

// User Model

const User = mongoose.model("User", UserSchema);

// validate Register user

function validateRegisterUser(obj) {
  const schema = joi.object({
    username: joi.string().trim().min(3).max(100).required(),
    email: joi.string().trim().min(5).max(100).required().email(),
    password: joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
}

// validate Login user

function validateLoginUser(obj) {
  const schema = joi.object({
    email: joi.string().trim().min(5).max(100).required().email(),
    password: joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
}


// validate Update user

function validateUpdateUser(obj) {
  const schema = joi.object({
    username: joi.string().trim().min(3).max(100),
    password: joi.string().trim().min(8),
    bio: joi.string(),
  });
  return schema.validate(obj);
}

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
};
