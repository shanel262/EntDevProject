var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: { type: String, required: true } ,
	username: { type: String, unique: true, required: true } ,
	password: { type: String, required: true },
	role: { type: String, required: true}
});

module.exports = mongoose.model('users', UserSchema);
