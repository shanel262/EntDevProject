var Module = require('./module.model');


function handleError(res, err) {
  console.log(err);
  return res.status(500).json(err);
}

exports.getModules = function(req, res){
	console.log('getModules API:', req.params.userId)
	Module.find({lecturer: req.params.userId}, function(err, modules){
		if(err){handleError(res, err)}
		else{
			console.log('Found modules:', modules)
			res.status(200).json(modules)
		}
	})
}

exports.addModule = function(req, res){
	console.log('addModule API:', req.body)
	var module = {
		name: req.body.name,
		lecturer: req.body.lecturer,
		hidden: req.body.hidden
	}
	Module.create(module, function(err, module){
		if(err){handleError(res, err)}
		else{
			console.log('Added module:', module)
			res.status(201).json(module)
		}
	})
}
