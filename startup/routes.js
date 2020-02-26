const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const expressLayaouts = require('express-ejs-layouts');

// session set up
const path = require('path');
const createError = require('http-errors');
const session = require('express-session');
const passport = require('passport');
require('../config/passport')(passport);
const flash = require('connect-flash');
const validator = require('express-validator');
const MongoStore = require('connect-mongo')(session);



const home = require('../controllers/home');
const categories = require('../controllers/categories');
const products = require('../controllers/products');
// const auth = require('../controllers/auth');
const users = require('../controllers/users');
const cart = require('../controllers/cart');





module.exports = function(app) {
  app.use(express.json());
  app.use(express.static('public'));
  app.use(bodyParser.urlencoded({extended: false}));


  // EJS
  app.use(expressLayaouts);
  app.set('view engine', 'ejs');
  // app.set('views', './views');


  // session set up
  app.use(validator());
  app.use(cookieParser());
  app.use(session({
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
  }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());


  
  app.use(async (req, res, next) => {
    res.locals.login = req.isAuthenticated();
    res.locals._ = require('underscore');
    res.locals.title = '';
    res.locals.active_tab = '';
    res.locals.categories = await require('../models/category').find();
    res.locals.session = req.session;
    next();
  });


  app.use('/categories', categories);
  app.use('/products', products);
  // app.use('/auth', auth);
  app.use('/users', users);
  app.use('/cart', cart);

  app.use('/', home);


  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
}