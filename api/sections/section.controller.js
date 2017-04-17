var Section = require('./section.model');
var Module = require('../modules/module.model')
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

exports.deleteFile = function(req, res){
	console.log('AT deleteFile API:', req.body.secId)
	console.log('AT deleteFile API:', req.body)
	Section.update({ _id: req.body.secId }, { $pull: { content: { _id: req.body.fileId } } }, { safe: true },
		function(err, file) {
			if (err) {handleError(res, err)}
			else{
				console.log('File deleted:', file)
				return res.status(200).json(file)
			}
	})
}

exports.unlink = function(req, res){
	console.log('AT unlink API:', req.body)
	Module.find({'sections._id': req.body.secId}, function(err, modules){
		if(err){handleError(res, err)}
		else if(modules.length > 1){
			console.log('Found modules:', modules)
			Section.find({_id: req.body.secId}, function(err, section){
				if(err){handleError(res, err)}
				else{
					var dupSection = {
						name: section[0].name,
						description: section[0].description,
						content: section[0].content,
						hidden: section[0].hidden
					}
					Section.create(dupSection, function(err, newSection){
						if(err){handleError(res, err)}
						else{
							console.log('New section made:', newSection)
							Module.findById(req.body.modId, function(err, module){
								if(err){handleError(res, err)}
								else{
									module.sections.forEach(function(section){
										if(section._id == req.body.secId){
											section._id = newSection._id
										}
									})
									module.save()
									res.status(200).json(module)
								}
							})
						}
					})
				}
			})
		}
		else{
			console.log('Only exists once:', modules)
			res.status(304).send('It is not linked to any other module')
		}
	})
}

exports.showSection = function(req, res){
	console.log('AT showSection API:', req.body)
	Section.findById({_id: req.body.sectionId}, function(err, section){
		if(err){handleError(res, err)}
		else{
			console.log('Found section:', section)
			section.hidden = false
			section.save()
			return res.status(200).json(section)
		}
	})
}

exports.hideSection = function(req, res){
	console.log('AT hideSection API:', req.body)
	Section.findById({_id: req.body.sectionId}, function(err, section){
		if(err){handleError(res, err)}
		else{
			console.log('Found section:', section)
			section.hidden = true
			section.save()
			return res.status(200).json(section)
		}
	})
}
