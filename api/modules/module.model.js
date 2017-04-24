var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var SectionsSchema = new Schema({
	index: Number,
	_id: String
})

var ModuleSchema = new Schema({
	name: { type: String, required: true },
	sections: [SectionsSchema],
	lecturer: {type: String, required: true},
	students: [String],
	hidden: Boolean
});

module.exports = mongoose.model('modules', ModuleSchema);
