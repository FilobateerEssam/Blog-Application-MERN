const router = require('express').Router();

const { getAllUsersCtrl, getUserProfileCtrl, UpdateUserProfileCtrl, getUsersCountCtrl, profilePhotoUploadCtrl, deleteUserProfi1eCtrl } = require('../Controllers/usersController');

const { verifyTokenAdmin , verifyToken, verifyTokenOnlyuser, verifyTokenAndAuthorization } = require('../Middlewares/verifyToken');

const validateObjectId  = require('../Middlewares/validateObjectid');
const photoUpload = require('../Middlewares/photoUpload');

// /api/users/Profile

router.route('/Profile').get(verifyTokenAdmin ,getAllUsersCtrl);



// /api/users/Profile/:id

router.route('/Profile/:id')
    .get(validateObjectId,getUserProfileCtrl)
    .put(validateObjectId,verifyTokenOnlyuser,UpdateUserProfileCtrl)
    .delete(validateObjectId,verifyTokenAndAuthorization,deleteUserProfi1eCtrl);


// /api/users/Profile/profile-Photo-Upload

router.route('/Profile/profile-Photo-Upload')
                        // single means only one image will upload and here image is the name of the field
 .post(verifyToken , photoUpload.single("image") ,profilePhotoUploadCtrl);





// /api/users/count
router.route('/count').get(verifyTokenAdmin,getUsersCountCtrl)




module.exports = router;