var express = require('express');
var controller = require('./module.controller');

var router = express.Router();

router.get('/getModulesLecturer/:userId', controller.getModulesLecturer); //Get modules for a user
router.get('/getModulesStudent/:userId', controller.getModulesStudent); //Get modules for a user
router.post('/addModule', controller.addModule) //Add a module
router.get('/getModule/:moduleId', controller.getModule) //Get single module
router.post('/addSection', controller.addSection)
router.post('/importSections', controller.importSections); //Import sections
router.post('/addStudent', controller.addStudent)
router.post('/removeStudent', controller.removeStudent)

module.exports = router;
