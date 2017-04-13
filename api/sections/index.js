var express = require('express');
var controller = require('./section.controller');

var router = express.Router();

router.get('/getSection/:sectionId', controller.getSection); //Get modules for a user
// router.post('/register', controller.register); //Register a user

module.exports = router;
