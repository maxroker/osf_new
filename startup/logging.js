const winston = require('winston');  //logger
require('winston-mongodb');
require('express-async-errors');


const url = 'mongodb+srv://dankomaksym:12250205@categories-y532d.mongodb.net/osf_project?retryWrites=true&w=majority';

module.exports = function() {

  process.on('unhandledRejection', (ex) => {
    throw ex;
  })

  winston.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    handleExceptions : true
  }));

  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
  winston.add(new winston.transports.MongoDB({ db: url, options: {useUnifiedTopology: true} }));
  winston.add(new winston.transports.File({ filename: 'uncaughtExceptions.log', handleExceptions : true }));

};

