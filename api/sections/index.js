var express = require('express');
var controller = require('./section.controller');

var router = express.Router();

router.get('/getSection/:sectionId', controller.getSection); //Get a section for a module
router.get('/getSections', controller.getSections); //Get sections for a module
// router.post('/register', controller.register); //Register a user

module.exports = router;
