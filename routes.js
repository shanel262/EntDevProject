module.exports = function(app) {

  app.use('/api/users', require('./api/users/index'));
  app.use('/api/modules', require('./api/modules/index'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|app|assets)/*')
   .get(function(req, res) {
    res.send(404);
  })

};