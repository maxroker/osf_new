var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  })
})


module.exports = function(passport) {
    passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done) {
      // console.log(req);
      req.checkBody('name', 'Invalid name').notEmpty().isLength({min:4, max: 256});
      req.checkBody('email', 'Invalid email').notEmpty().isEmail();
      req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4, max: 1024});
      var errors = req.validationErrors();
      if (errors) {
        var messages = [];
        errors.forEach((error) => {
          messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
      }
      User.findOne({ 'email': email }, function(err, user) {
        if (err) { 
          return done(err); 
        };
        
        if (user) {
          return done(null, false, { message: 'Email is already in use' });
        };
        var newUser = new User();
        newUser.name = req.body.name;
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.temporarytoken = newUser.generateAuthToken();
        newUser.save(function(err, result) {
          if (err) {
            return done(err);
          }
          return done(null, newUser);
        })
      });
    }
  ));

  passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done) {
      req.checkBody('email', 'Invalid email').notEmpty().isEmail();
      req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
      var errors = req.validationErrors();
      if (errors) {
        var messages = [];
        errors.forEach((error) => {
          messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
      }
      User.findOne({ 'email': email }, function(err, user) {
        if (err) { 
          return done(err); 
        };
        
        if (!user) {
          return done(null, false, { message: 'User is not found' });
        };
        if(!user.validPassword(password)) {
          return done(null, false, { message: 'Wrong password.' });
        }
        return done(null, user);
      });
    }
  ));
};


