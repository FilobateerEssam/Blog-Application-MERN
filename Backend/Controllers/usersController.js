const asyncHandler = require('express-async-handler');
const {User, validateUpdateUser } = require("../Models/User"); 
const bcrypt = require('bcryptjs');
const path = require('path');
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require('../utils/cloudinary');
const { use } = require('../routes/usersRoute');
const fs = require('fs');

/**----------------------------------------
 * @desc   Get All Users Profile
 * @route /api/users/Profile
 * @method GET
 * @access private (only Admin)
/**---------------------------------------- */

module.exports.getAllUsersCtrl = asyncHandler(async (req,res) => {
    

    // find Get All Users from db but findone get only one user by specific thing
    

     const users = await User.find().select("-password").populate("posts");
    
    res.status(200).json({users});
});

/**----------------------------------------
 * @desc   Get Single User Profile
 * @route /api/users/Profile/:id
 * @method GET
 * @access Public  
/**---------------------------------------- */


module.exports.getUserProfileCtrl = asyncHandler(async (req,res) => {
    

    // find Get All Users from db but findone get only one user by specific thing
    
    // params.id is the id from url
                                                     // without password
     const user = await User.findById(req.params.id).select("-password").populate("posts");

     if(!user) {
        
        return res.status(404).json({message: "User Not Found"});
     }

     res.status(200).json({user});
});


/**----------------------------------------
 * @desc   Update Single User Profile
 * @route /api/users/Profile/:id
 * @method Put
 * @access private (only user himself and admin can't update))  
/**---------------------------------------- */


module.exports.UpdateUserProfileCtrl = asyncHandler(async (req,res) => {
    

     // validation from user model

     const {error} = validateUpdateUser(req.body);

     if(error) {
            return res.status(400).json({message: error.details[0].message});
     }

     // check password encryption

     if(req.body.password) {
        
        // salt is random string added to password to make it more secure   
        const salt = await bcrypt.genSalt(10);
        
        // hash password
        req.body.password = await bcrypt.hash(req.body.password, salt);
     }

      // update user

     const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        // set used to update only the fields that are sent in the request body
        // pros : if we have 100 fields and we want to update only 1 field we use set
        // cons : if we have 100 fields and we want to update 99 fields we use save
        // Ex : if we want to update only username will Update only username and leave the password and bio as it is
        $set: {
            username: req.body.username,
            password: req.body.password,
            bio: req.body.bio,
        }
     },{new: true}).select("-password");

     res.status(200).json({updatedUser});
});



/**----------------------------------------
 * @desc   Count User Profile
 * @route /api/users/count
 * @method Get
 * @access private (only admin)  
/**---------------------------------------- */

module.exports.getUsersCountCtrl = asyncHandler(async (req,res) => {
    

    // find Get All Users from db but findone get only one user by specific thing
    

     const count = await User.count();
    
    res.status(200).json({count});
});



/**----------------------------------------
 * @desc   Profile Photo Upload
 * @route /api/users/Profile/profile-Photo-Upload
 * @method Post
 * @access private (only logged in user))  
/**---------------------------------------- */

module.exports.profilePhotoUploadCtrl = asyncHandler(async (req,res) => {

    // VALIDATION

    if(!req.file) {
        return res.status(400).json({message: "Please Upload an Image"});
    }


    // get the path of the image

    const imagePath = path.join(__dirname,`../Images/${req.file.filename}`);

    // upload to cloudinary

    const result = await cloudinaryUploadImage(imagePath);
    console.log(result);

    // get the user from db

    const user = await User.findById(req.user.id);

    // delete the old profile image if exists

    if(user.profilePhoto.publicid !== null) {
        await cloudinaryRemoveImage(user.profilePhoto.publicid);
    }

    // change the profile image in db

    user.profilePhoto = {
        url : result.secure_url , 
        publicid: result.public_id ,
    };

    await user.save();

    // send the response to client

    res.status(200).json({message: "Profile Photo Upload Success" , 
    profilePhoto : {url: result.secure_url , publicid: result.public_id}
    });

    // remove the image from server which in images folder
    
    // fs unlinkSync is used to delete the file from folders using path 
    fs.unlinkSync(imagePath);
});


/**----------------------------------------
 * @desc  Delete User Profile (Account)
 * @route /api/users/Profile/:id
 * @method Delete
 * @access private (only admin or user himself )  
/**---------------------------------------- */

module.exports.deleteUserProfi1eCtrl = asyncHandler(async (req,res) => {
    
    // 1. get the user from db
    
    const user = await User.findById(req.params.id);
    if(!user) {
        return res.status(404).json({message: "User Not Found"});
    }
    // @TODO 2. get All posts from db

    // @TODO 3. get the pulic ids from the posts 

    // @TODO 4. delete all posts Images  from cloudinary that belong to this user

    // 5. delete the profile picture from cloudinary that belong to this user

    await cloudinaryRemoveImage(user.profilePhoto.publicid);


    // @TODO 6. delete  user Posts and Comments 

    // 7. delete the user himself

    await User.findByIdAndDelete(req.params.id);

    // 8. send the response to client

    res.status(200).json({message: "User Deleted Successfully"});


});