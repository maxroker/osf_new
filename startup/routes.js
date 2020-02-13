const express = require('express');

const home = require('../routes/home');
const categories = require('../routes/categories');
const products = require('../routes/products');


module.exports = function(app) {
  app.use(express.json());
  app.use(express.static('public'));
  app.set('view engine', 'ejs');
  app.set('views', './views');


  app.use('/', home);
  app.use('/products', products);

  // app.use('/mens', categories);
  // app.use('/womens', categories);
  // app.get('/about', function(req, res) {
  //   res.render('pages/about');
  // });
}