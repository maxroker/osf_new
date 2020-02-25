const express = require('express');
const app = express();
const winston = require('winston');




require('./startup/logging')();
require('./startup/config')();

require('./startup/db')();

require('./startup/routes')(app);
require('./startup/prod')(app);



const port = process.env.PORT || 80;

const server = app.listen(port, () => {
  winston.info(`Listening on port ${port}...`);
});


module.exports = server;
