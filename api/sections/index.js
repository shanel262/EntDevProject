var express = require('express');
var controller = require('./section.controller');
var multer = require('multer');
var upload = multer({ dest: __dirname + '/../../files'})

var router = express.Router();

router.get('/getSection/:sectionId', controller.getSection); //Get a section for a module
router.get('/getSections', controller.getSections); //Get sections for a module
router.post('/uploadFile', upload.single('myFile'), controller.uploadFile); //Upload a file
router.get('/downloadFile/:fileId', controller.downloadFile); //Download a file
router.get('/unlink/:sectionId', controller.unlink) //unlink a section

module.exports = router;
