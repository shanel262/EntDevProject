var Section = require('./section.model');


function handleError(res, err) {
  console.log(err);
  return res.status(500).json(err);
}
