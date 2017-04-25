var Module = require('./module.model');
var Section = require('../sections/section.model')

function handleError(res, err) {
  console.log(err);
  return res.status(500).json(err);
}

exports.getModulesLecturer = function(req, res){
	console.log('getModules API:', req.params.userId)
	Module.find({lecturer: req.params.userId}, function(err, modules){
		if(err){handleError(res, err)}
		else{
			console.log('Found modules:', modules)
			res.status(200).json(modules)
		}
	})
}

exports.getModulesStudent = function(req, res){
	console.log('getModules API:', req.params.userId)
	Module.find({students: req.params.userId}, function(err, modules){
		if(err){handleError(res, err)}
		else{
			console.log('Found modules:', modules)
			res.status(200).json(modules)
		}
	})
}

exports.getModule = function(req, res){
	console.log('getModule API:', req.params.moduleId)
	Module.findById(req.params.moduleId, function(err, module){
		if(err){handleError(res, err)}
		else{
			console.log('Found module:', module)
			res.status(200).json(module)
		}
	})
}

exports.addModule = function(req, res){
	console.log('addModule API:', req.body)
	var module = {
		name: req.body.name,
		lecturer: req.body.lecturer,
		hidden: req.body.hidden
	}
	Module.create(module, function(err, module){
		if(err){handleError(res, err)}
		else{
			console.log('Added module:', module)
			res.status(201).json(module)
		}
	})
}

exports.addSection = function(req, res){
	console.log('addSection API:', req.body)
	var section = {
		name: req.body.name,
		description: req.body.description,
		hidden: req.body.hidden
	}
	Section.create(section, function(err, section){
		if(err){handleError(res, err)}
		else{
			console.log('Section created', section)
			// return res.status(200).json(section)
			Module.findById(req.body.moduleId, function(err, module){
				if(err){handleError(res, err)}
				else{
					console.log('Found module:', module)
					var insertSection = {
						index: module.sections.length,
						_id: section._id
					}
					module.sections.push(insertSection)
					module.save()
					res.status(200).json(module)
				}
			})
		}
	})
}

exports.importSections = function(req, res){
	console.log('importSections PAI:', req.query.sectionIds)
	Module.findById(req.query.sectionIds.pop(), function(err, module){
		if(err){handleError(res, err)}
		else{
			console.log('Found module:', module)
			console.log('LENGTH:', req.query.sectionIds)
			for(var i = 0; i < req.query.sectionIds.length; i++){
				var insertSection = {
					index: module.sections.length,
					_id: req.query.sectionIds[i]
				}
				console.log('NEW SECTION:', insertSection)
				module.sections.push(insertSection)
			}
			module.save()
			return res.status(200).json(module)
		}
	})
}

exports.addStudent = function(req, res){
	console.log('Add student to module:', req.body)
	Module.findByIdAndUpdate(req.body.moduleId, {$push: {'students': req.body.studentId}}, function(err, student){
		if(err){handleError(res, err)}
		else{
			console.log('Student added to module')
			return res.status(200).json(student)
		}
	})
}

exports.removeStudent = function(req, res){
	console.log('Remove student from module:', req.body)
	Module.findByIdAndUpdate(req.body.moduleId, {$pull: {'students': req.body.studentId}}, function(err, student){
		if(err){handleError(res, err)}
		else{
			console.log('Student removed from module')
			return res.status(200).json(student)
		}
	})
}
