var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var ContentSchema = new Schema({
	name: { type: String, required: true },
	multerId: { type: String, required: true }
})

var SectionSchema = new Schema({
	name: { type: String, required: true },
	description: String,
	content: [ContentSchema]
});

module.exports = mongoose.model('sections', SectionSchema);
