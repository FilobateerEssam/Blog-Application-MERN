const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { User , validateRegisterUser , validateLoginUser } = require("../Models/User");

// description  Register User
/**----------------------------------------
 * @desc   Register User
 * @route /api/auth/register
 * @method POST
 * @access Public
/**---------------------------------------- */

module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
    
    // Valditation

    const { error } = validateRegisterUser(req.body);
    if (error) {
        // status 400 Bad Request from client not server
        return res.status(400).json({message: error.details[0].message});
    }


    // is user already exists

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({message: "User already exists"});
    }


    // hash password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // new user and save to db

    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    });

    // save user to db
    await user.save();

    // @TODO - sending email (verify account )

    // send response to client
    
    // 201 Created Successfully 
    res.status(201).json({messsage : "you have registered successfully , please login now"});

});



// description  Register User
/**----------------------------------------
 * @desc   Login User
 * @route /api/auth/login
 * @method POST
 * @access Public
/**---------------------------------------- */

module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
    
    // 1.validation
    const { error} = validateLoginUser(req.body);

    if (error) {
        return res.status(400).json({message: error.details[0].message});
    }

    // 2.is user not exists
    
    let user = await User.findOne({email: req.body.email});
    if (!user){
        return res.status(400).json({message:"invalid email or password"})
    } 

    
    // 3. check password

    let isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    
    if (!isPasswordMatch){
        return res.status(400).json({message:"invalid email or password"})
    } 

    // 4. Generate token (jwt)

    // @TODO - sending email (verify account if not verified)
    const token = user.generateAuthToken();

    // 5. response to client

    res.status(200).json({  
        _id: user._id,
        isAdmin: user.isAdmin,
        profilePhoto:user.profilePhoto,
        token,
    });
});