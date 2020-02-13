const express = require('express');

const home = require('../controllers/home');
const categories = require('../controllers/categories');
const products = require('../controllers/products');


module.exports = function(app) {
  app.use(express.json());
  app.use(express.static('public'));
  app.set('view engine', 'ejs');
  app.set('views', './views');


  app.use('/categories', categories);
  app.use('/products', products);
  app.use('/', home);
  

  // app.use('/mens', categories);
  // app.use('/womens', categories);
  // app.get('/about', function(req, res) {
  //   res.render('pages/about');
  // });
}