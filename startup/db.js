const mongoose = require('mongoose');
const winston = require('winston');



module.exports = function() {
  // const db = 'mongodb+srv://dankomaksym:12250205@categories-y532d.mongodb.net/osf_project?retryWrites=true&w=majority';
  const db = 'mongodb://localhost/osf_project';

  mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => winston.info(`Connected to genres ${db}...`))
}
