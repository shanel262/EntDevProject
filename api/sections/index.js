var express = require('express');
var controller = require('./section.controller');
var multer = require('multer');
var upload = multer({ dest: __dirname + '/../../files'})

var router = express.Router();

router.get('/getSection/:sectionId', controller.getSection); //Get a section for a module
router.get('/getSections', controller.getSections); //Get sections for a module
router.post('/uploadFile', upload.single('myFile'), controller.uploadFile); //Upload a file
router.get('/downloadFile/:fileId', controller.downloadFile); //Download a file
router.post('/unlink', controller.unlink) //unlink a section
router.post('/show', controller.showSection) //Show a section
router.post('/hide', controller.hideSection) //Hide a section
router.post('/deleteFile', controller.deleteFile) //Delete a file

module.exports = router;
