var User = require('./user.model');


function handleError(err) {
  console.log(err);
  return res.send(500, err);
}

// Login user
exports.login = function(req, res){
	console.log('IN LOGIN API:', req.body.username)
	User.findOne({username: req.body.username}, 
		function(err, user){
			if(err){handleError(err)}
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
		password: req.body.password
	}
	User.create(user, function(err, user){
		if(err){handleError(err)}
		else{
			console.log('User created:', user)
			return res.status(201).json(user)
		}
	})
}

//   // Get list of users
//   exports.index = function(req, res) {
//     User.find(function (err, users) {
//       if(err) { return handleError(res, err); }
//       return res.json(200, users);
//     });
//   } ;

//   // Creates a new user
//   exports.create = function(req, res) {
//     var user = {
//      name: req.body.name,
//      username: req.body.username,
//      password: req.body.password 
//    };
//    User.create(user, function(err, user){
//     if(err){return handleError(res, err);}
//     console.log('User created');
//     return res.json(201, user);
//   })
//  };

//  exports.singleUser = function(req, res){
//   User.findById(req.params.id, function (err, user) {
//     if(err){return handleError(res, err);}
//     console.log('Returning user: ' + user.name);
//     return res.json(200, user);
//   });
// }

//  // Update an existing user
//  exports.update = function(req, res) {
//   User.findById(req.body.id, function (err, user) {
//     if(err){handleError(res, err);}
//     user.name = req.body.name
//     user.username = req.body.username
//     user.password = req.body.password
//     user.save(function(err){
//       if(err){return handleError(res, err);}
//       return res.send(200, 'Update successful');
//     })
//   });
// }

// exports.destroy = function(req, res) {
//   User.remove({_id: req.params.id}, function(err){
//     if(!err){
//       console.log('User has been deleted');
//     }
//   })
//   return res.json(200, 'Delete successful');
// };