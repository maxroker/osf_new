const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');



module.exports = function() {
  const password = config.get('db');
  const db = `mongodb+srv://dankomaksym:${password}@categories-y532d.mongodb.net/osf_project?retryWrites=true&w=majority`;
  // const db = 'mongodb://localhost/osf_project';

  mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => winston.info(`Connected to genres ${db}...`))
}
