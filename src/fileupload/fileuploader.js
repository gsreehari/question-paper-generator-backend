const multer = require('multer');
const path = require('path');
const fs = require('fs')
const { questionId } = require('../id_generator/idGenerator')

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/question images')
    },
    filename: (req, file, cb) => {
        var id;
        if(req.body.questionId){
            id = req.body.questionId
        }else{
            id = questionId();
            req.body.questionId = id;
        }
        cb(null, 'image-' + id + path.extname(file.originalname))
    }
});

//will be using this for uplading
const upload = multer({ storage: storage });


var usersStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, './public/uploads/profile pics')
    },
    filename: (req, file, cb) => {
        return cb(null,`image-${req.decoded.result.userId}${path.extname(file.originalname)}`)
    }
});

//will be using this for uplading
const profilePicupload = multer({ storage: usersStorage });

module.exports = {upload,profilePicupload}