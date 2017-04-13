  var express = require('express');
  var controller = require('./module.controller');

  var router = express.Router();

  router.get('/getModules/:userId', controller.getModules); //Get modules for a user
  router.post('/addModule', controller.addModule) //Add a module
  // router.post('/register', controller.register); //Register a user

  module.exports = router;
