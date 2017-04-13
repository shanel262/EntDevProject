var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var ModuleSchema = new Schema({
	name: { type: String, required: true },
	sections: [Number],
	lecturers: [Number],
	students: [Number],
	hidden: Boolean
});

module.exports = mongoose.model('modules', ModuleSchema);
