const path = require('path');
const multer = require('multer'); // for uploading files
const e = require('express');

// photo storage

const photoStorage = multer.diskStorage({
    destination: function(req,file,cb) {

        // place where we want to store our images

        cb(null,path.join(__dirname,"../Images"));
    },

    filename: function(req,file,cb) {
        if(file){
            // means if file is not null then we will store the file with date and time + original name 
            // that is Specific way to store images
            cb(null,new Date().toISOString().replace(/:/g, '-') + file.originalname);
        }else{
            cb(null,false);
        }
    }
});


// Photo Upload Middleware

const photoUpload = multer({
    storage: photoStorage,

    // mean the file type is image only
    fileFilter: function(req,file,cb) {  
        
        // if you want to upload only images with specific type will image/png or image/jpg 
        // but image only will upload all types of images

        if(file.mimetype.startsWith("image")) {
            cb(null,true);
        }else{
            cb({message: "Unsupported file format"},false);
        }
    },
    limits: { fileSize: 1024 * 1024  } // 1 MB megabyte
});

module.exports = photoUpload;