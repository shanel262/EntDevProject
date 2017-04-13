var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var SectionSchema = new Schema({
	name: { type: String, required: true },
	description: String,
	content: [Number]
});

module.exports = mongoose.model('sections', SectionSchema);
