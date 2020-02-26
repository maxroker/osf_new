const express = require('express');
const router = express.Router();
const passport = require('passport');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const csrf = require('csurf');

const User = require('../models/user');
const Order = require('../models/order');
const Cart = require('../models/cart');



const nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.get('mail_user'), // generated ethereal user
    pass: config.get('mail_pass') // generated ethereal password
  }
});


// this route can not pass csrfProtection
router.post('/activate', async (req, res) => {
  const token = req.body.token;
  const user = await User.findOne({_id: req.body.id});

  const isValid = await jwt.verify(token, config.get('jwtPrivateKey'));
  // console.log(isValid);
  if (isValid) {
    user.active = true;
    await user.save();

    let info = await transporter.sendMail({
      from: config.get('mail_user'), // sender address
      to: user.email, // list of receivers
      subject: "Thank you for verifying your email at OSFAcademy", // Subject line
      text: `Hello ${user.name}.
            Your account has been successfully activated.`, // plain text body
      html: `Hello <strong> ${user.email}</strong>. 
            <br>
            Your account has been successfully activated.`
    });

    req.flash('success', 'You have activated your account!');   
    res.redirect('/');
  }         
});

// this route can not pass csrfProtection
router.post('/reset-password', async (req, res) => {
  // console.log(req.body);
  const user = await User.findOne({_id: req.body.id});
  const token = user.temporarytoken;


  const isValid = await jwt.verify(token, config.get('jwtPrivateKey'));
  // console.log('hello');
  // console.log(isValid);
  if (isValid) {
    user.password = user.encryptPassword(req.body.password);
    await user.save();

    let info = await transporter.sendMail({
      from: config.get('mail_user'), // sender address
      to: user.email, // list of receivers
      subject: "Your password has been changed at OSFAcademy", // Subject line
      text: `Hello ${user.name}.
            Your password has been successfully changed.`, // plain text body
      html: `Hello <strong> ${user.name}</strong>. 
            <br>
            Your password has been successfully changed.`
    });

    req.flash('success', 'Your password has been successfully changed.');   
    res.redirect('/');
  }         
});



const csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, async (req, res, next) => {

  Order.find({user: req.user}, function(err, orders) {
    if(err) {
      return res.write('Error!');
    }
    var cart;
    orders.forEach(function(order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile', { orders: orders });
  }); 
  
});

router.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout();
  req.flash('success', 'Your have logged out.');   
  res.redirect('/');
});


router.use('/', notLoggedIn, function(req, res, next) {
  next();
});

router.get('/signup', async (req, res, next) => {

  var messages = req.flash('error');
  res.render('user/signup', { 
    csrfToken: req.csrfToken(), 
    messages: messages, 
    hasErrors: messages.length > 0,
  });
});


router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/users/signup',
  failureFlash: true
}), async (req, res, next) => {
  const action = `${req.headers.origin}/users/activate`;
  const user = req.user;
  // console.log(req.session);
  let info = await transporter.sendMail({
    from: config.get('mail_user'), // sender address
    to: user.email, // list of receivers
    subject: "Hello, Please verify your email for OSFAcademy", // Subject line
    html: `Hello <strong> ${user.name}</strong>. 
          Thank you for registering at ${req.headers.host}. 
          Please click on the link below to complete your activation:
          <form action="${action}" method="post">
            <input name="id" value="${user._id}" type="hidden"/>
            <input name="token" value="${user.temporarytoken}" type="hidden"/>
            <button type="submit">Activate your account</button>
          </form>`});
  
  req.flash('success', 'You have created a new account! Check your email for activation.');   
  res.redirect('/');

});


router.get('/signin', async (req, res, next) => {
  var messages = req.flash('error');
  res.render('user/signin', { 
    csrfToken: req.csrfToken(), 
    messages: messages, 
    hasErrors: messages.length > 0 
  });
});

router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/users/signin',
  failureFlash: true
}), function(req, res, next) {
  // res.redirect('/');
  
  req.flash('success', 'You have successfully signed in!');   
  res.redirect('/');
});


router.get('/reset-password', async (req, res, next) => {
  var messages = req.flash('error');
  res.render('user/reset-password', { 
    csrfToken: req.csrfToken(), 
    messages: messages, 
    hasErrors: messages.length > 0 
  });
});


router.post('/reset-password-letter', async (req, res) => {
  // console.log(req.body)
  const email = req.body.email;
  const token = req.csrfToken();
  const newPassword = req.body.password;
  const action = `${req.headers.origin}/users/reset-password`;

  const user = await User.findOne({email: email});

  if (user) {
    let info = await transporter.sendMail({
      from: config.get('mail_user'), // sender address
      to: email, // list of receivers
      subject: "You have requested a password change at OSFAcademy", // Subject line
      html: `Hello <strong> ${user.name}</strong>. 
            You have requested a password change for your account at ${req.headers.host}. 
            Please click on the link below to complete the change:
            <form action="${action}" method="post">
              <input name="id" value="${user._id}" type="hidden"/>
              <input name="password" value="${newPassword}" type="hidden"/>
              <input name="_csrf" value="${token}" type="hidden"/>
              <button type="submit">Reset Password</button>
            </form>`
    });

    req.flash('success', 'Check your email for password change confirmation.');      
    res.redirect('/');
  }  
});





module.exports = router;


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};







