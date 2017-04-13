var Module = require('./module.model');


function handleError(res, err) {
  console.log(err);
  return res.status(500).json(err);
}

exports.getModules = function(req, res){
	console.log('getModules API:', req.params.userId)
	return res.status(200).send('SUCCESS AT API')
}
