  var express = require('express');
  var controller = require('./user.controller');

  var router = express.Router();

  router.post('/login', controller.login); //Login user
  router.post('/register', controller.register); //Register a user
  // router.post('/registerUser', controller.create); //Create a user
  // router.put('/updateUser/:id', controller.update); //Update a user
  // router.delete('/deleteUser/:id', controller.destroy); //Delete a user

  module.exports = router;
