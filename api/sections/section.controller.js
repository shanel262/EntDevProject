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
