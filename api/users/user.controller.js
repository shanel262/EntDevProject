var User = require('./user.model');


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
				console.log('USER EXISTS:', user)
				if(user.password === req.body.password){
					return res.status(200).json(user)	
				}
				else{
					return res.status(403).send("Incorrect password")
				}
			}
		})
}

// Register a user
exports.register = function(req, res){
	console.log('IN REGISTER API:', req.body)
	var user = {
		name: req.body.name,
		username: req.body.username,
		password: req.body.password,
		role: req.body.role
	}
	User.create(user, function(err, user){
		if(err){handleError(res, err)}
		else{
			console.log('User created:', user)
			return res.status(201).json(user)
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
