const express = require('express');

const home = require('../routes/home');


module.exports = function(app) {
  app.use(express.json());
  app.use(express.static('public'));
  app.set('view engine', 'ejs');
  app.set('views', './views');


  app.use('/', home);
}