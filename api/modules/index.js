  var express = require('express');
  var controller = require('./module.controller');

  var router = express.Router();

  router.get('/getModules/:userId', controller.getModules); //Login user
  // router.post('/register', controller.register); //Register a user

  module.exports = router;
