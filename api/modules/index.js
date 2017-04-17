var express = require('express');
var controller = require('./module.controller');

var router = express.Router();

router.get('/getModules/:userId', controller.getModules); //Get modules for a user
router.post('/addModule', controller.addModule) //Add a module
router.get('/getModule/:moduleId', controller.getModule) //Get single module
router.post('/addSection', controller.addSection)
router.post('/importSections', controller.importSections); //Import sections

module.exports = router;
