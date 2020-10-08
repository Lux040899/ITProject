const express = require('express');
const userController = require("../controllers/userController");
const photoController = require("../controllers/photosController");
const router = express.Router();
const { check } = require('express-validator');
const fileUpload = require("../middlerware/file-upload");
const user = require('../models/user');


router.get('/', userController.getUsers);

router.get('/check', userController.check);

router.post('/signup', fileUpload.array('files',10), [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").not().isEmpty(), 
    check("password").isLength({ min: 6 }), ] , userController.signup);

router.post('/login', check('email').normalizeEmail(),userController.login);

router.get('/logout', (req, res) => {
    req.logout();
    res.send({ success : true, message : 'logged out' }); 
});

// this route send the login status back to front end.
router.get('/check', userController.check);

router.post('/profilePhoto', fileUpload.single('file'), photoController.addProfilePhoto);
router.get('/profilePhoto', photoController.getProfilePhoto);

router.post('/coverImages', fileUpload.array('files',5), photoController.addCoverImages);
router.get('/coverImages', photoController.getCoverImages);
router.get('/coverImages/:id', photoController.getCoverImagesById);

router.post('/bgImage', fileUpload.single('file'), photoController.addBgImage);
router.get('/bgImage', photoController.getBgImage);

// expect user email address
router.post('/forgot', userController.forgotPassword);
router.get('/resetPassword/:token', userController.checkToken);
router.post('/resetPassword/:token', userController.resetPassowrd);
module.exports = router;