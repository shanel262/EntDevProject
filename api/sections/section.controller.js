var Section = require('./section.model');
var path = require('path')

function handleError(res, err) {
  console.log(err);
  return res.status(500).json(err);
}

exports.getSection = function(req, res){
	Section.findById(req.params.sectionId, function(err, section){
		if(err){handleError(res, err)}
		else{
			console.log('Found section:', section)
			return res.status(200).json(section)
		}
	})
}

exports.getSections = function(req, res){
	console.log('getSections API:', req.query.sections)
	Section.find({_id: {$in: req.query.sections}}, function(err, sections){
		if(err){handleError(res, err)}
		else{
			console.log('Found sections:', sections)
			return res.status(200).json(sections)
		}
	})
}

exports.uploadFile = function(req, res){
	console.log('uploadFile API:', req.file)
	var content = {
		name: req.file.originalname,
		multerId: req.file.filename,
		mimetype: req.file.mimetype
	}
	Section.findById(req.body.sectionId, function(err, section){
		if(err){handleError(res, err)}
		else{
			console.log('Found section:', section)
			section.content.push(content)
			section.save()
			return res.status(200).redirect('/#/module/' + req.body.moduleId)			
		}
	})
}

exports.downloadFile = function(req, res){
	console.log('At downloadFile API:', req.params.fileId)
	console.log('DIR:', __dirname)
	Section.findOne({'content._id': req.params.fileId}, {'content.$.': true}).exec(function(err, data){
		if(err){handleError(res, err)}
		else{
			console.log('Found content:', data)
  			res.setHeader('Content-type', data.content[0].mimetype);
			var filepath = path.resolve(__dirname + '/../../files/' + data.content[0].multerId)
			res.download(filepath, data.content[0].name.toString())
		}
	})
}
