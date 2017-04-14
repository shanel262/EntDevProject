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
