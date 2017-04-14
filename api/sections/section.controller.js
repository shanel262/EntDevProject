var Section = require('./section.model');


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
	console.log('REQ:', req.body)
	var content = {
		name: req.file.originalname,
		multerId: req.file.filename
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
