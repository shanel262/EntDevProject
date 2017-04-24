var User = require('./user.model');
var jwt = require('jwt-simple');


function handleError(res, err) {
  console.log(err);
  return res.status(500).json(err);
}

// Login user
exports.login = function(req, res){
	console.log('IN LOGIN API:', req.body.username)
	User.findOne({username: req.body.username}, 
		function(err, user){
			if(err){handleError(res, err)}
			if(!user){
				console.log('USER NOT FOUND:')
				return res.status(404).send("User not found")
			}
			else{
				user.comparePassword(req.body.password, function(err, success){
					if(!success){
						return res.status(401).send('Incorrect password')
					}
					else{
						var token = jwt.encode(user, 'SECRET')
						return res.status(200).json({token: 'JWT ' + token})
					}
				})
			}
		})
}

// Register a user
exports.register = function(req, res){
	console.log('IN REGISTER API:', req.body)
	var user = new User({
		name: req.body.name,
		username: req.body.username,
		password: req.body.password,
		role: req.body.role
	})
	user.save(function(err){
		if(err){handleError(res,err)}
		else{
			return res.status(200).json(user)
		}
	})
}

//Get all users
exports.getAllStudents = function(req, res){
	User.find({'role': 'Student'}, function(err, users){
		if(err){handleError(res, err)}
		else{
			console.log('Found users')
			return res.status(200).json(users)
		}
	})
}
