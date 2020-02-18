const express = require('express');
const bodyParser = require('body-parser');


const home = require('../controllers/home');
const categories = require('../controllers/categories');
const products = require('../controllers/products');
const auth = require('../controllers/auth');
const users = require('../controllers/users');
const cart = require('../controllers/cart');





module.exports = function(app) {
  app.use(express.json());
  app.use(express.static('public'));
  app.use(bodyParser.urlencoded({extended: false}));



  app.set('view engine', 'ejs');
  app.set('views', './views');


  app.use('/categories', categories);
  app.use('/products', products);
  app.use('/cart', cart);
  app.use('/auth', auth);
  app.use('/users', users);
  app.use('/', home);
  
}