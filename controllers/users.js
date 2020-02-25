const express = require('express');
const router = express.Router();

const { User, userValidation, passwordValidation } = require('../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');

const nodemailer = require('nodemailer');


// new
const csrf = require('csurf');
const passport = require('passport');

const Order = require('../models/order');
const Cart = require('../models/cart');


const csrfProtection = csrf();
router.use(csrfProtection);

// Old
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.get('mail_user'), // generated ethereal user
    pass: config.get('mail_pass') // generated ethereal password
  }
});

// new 

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
  // console.log(req);
  // console.log(req.session);

  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    // res.redirect('/users/profile');
    res.redirect('/');
  }
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
  res.redirect('/');

  // // res.redirect('/cart/checkout');
  // if (req.session.oldUrl) {
  //   var oldUrl = req.session.oldUrl;
  //   req.session.oldUrl = null;
  //   res.redirect('/users/checkout');
  // } else {
  //   // res.redirect('/users/profile');
  //   res.redirect('/');
  // }
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




//old

// router.get('/me', auth, async (req, res) => {
//   const user = await User.findById(req.user._id).select('-password'); //exclude password
//   res.send(user);
// })

// router.post('/', async (req, res) => {
//   const { error } = userValidation(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const passwordError = passwordValidation(req.body.password).error;
//   if (passwordError) {
//     let errMessage = '';
//     const details = passwordError.details;
//     for (err in details) errMessage += 'Password ' + details[err].message + '\n';
//     return res.status(400).send(errMessage);
//   }

//   let user = await User.findOne({ email: req.body.email });
//   if (user) return res.status(400).send('User already registered');

//   // user = await new User(_.pick(req.body, ['name', 'email', 'password']));


//   user = await new User({
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password
//   });

//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(user.password, salt);
//   user.temporarytoken = user.generateAuthToken();

//   await user.save();

//   const token = user.temporarytoken;

//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: config.get('mail_user'), // sender address
//     to: user.email, // list of receivers
//     subject: "Hello, Please verify your email for OSFAcademy", // Subject line
//     text: `Hello ${user.name}.
//           Thank you for registering at localhost.com. 
//           Please click on the link below to complete your activation:
//           href="http://localhost/users/activate/${user.temporarytoken}`, // plain text body
//     html: `Hello <strong> ${user.name}</strong>. 
//           <br><br>
//           Thank you for registering at localhost.com. 
//           Please click on the link below to complete your activation:
//           <br><br>
//           <form action="http://localhost/users/activate/${user._id}" method="POST">
//             <input name="token" value="${user.temporarytoken}" type="hidden"/>
//             <button type="submit">Activate your account</button>
//           </form>`

          
// // `Hello <strong> ${user.name}</strong>. 
// //           <br><br>
// //           Thank you for registering at localhost.com. 
// //           Please click on the link below to complete your activation:
// //           <br><br>
// //           <a href="http://localhost/users/activate/${user.temporarytoken}">Activate your account</a>`
//   });

//   // console.log("Message sent: %s", info.messageId);
//   // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

//   res.json({success: true, message: 'Account registered! Please check your e-mail for activation link.'});
  
//   // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));

//   // res.send({
//   //   name: user.name,
//   //   email: user.email
//   // });
// });


// // router.get('/activate/:token', async (req, res) => {
// //   const user = await User.findOne({temporarytoken: req.params.token});
// //   // console.log(user);
// //   var token = req.params.token;



// router.post('/activate/:id', async (req, res) => {
//   const token = req.body.token;
//   const user = await User.findOne({_id: req.params.id});

//   const isValid = await jwt.verify(token, config.get('jwtPrivateKey'));
//   if (isValid) {
//     user.active = true;
//     user.save()
//       .then(async () => {
//         let info = await transporter.sendMail({
//           from: config.get('mail_user'), // sender address
//           to: user.email, // list of receivers
//           subject: "Thank you for verifying your email at OSFAcademy", // Subject line
//           text: `Hello ${user.name}.
//                 Your account has been successfully activated.`, // plain text body
//           html: `Hello <strong> ${user.name}</strong>. 
//                 <br><br>
//                 Your account has been successfully activated.`
//         });
//         res.json({success: true, message: 'Account actvated!'});
//       });
//   }      
   
// });





// router.post('/reset_password/:id', async (req, res) => {
//   const token = req.body.token;
//   const salt = await bcrypt.genSalt(10);
//   const password = await bcrypt.hash(req.body.password, salt);
//   const user = await User.findOne({_id: req.params.id});

//   const isValid = await jwt.verify(token, config.get('jwtPrivateKey'));
//   if (isValid) {
//     user.password = password;
//     user.save()
//       .then(async () => {
//         let info = await transporter.sendMail({
//           from: config.get('mail_user'), // sender address
//           to: user.email, // list of receivers
//           subject: "Password changed at OSFAcademy", // Subject line
//           text: `Hello ${user.name}.
//                 Your password has been successfully changed.`, // plain text body
//           html: `Hello <strong> ${user.name}</strong>. 
//                 <br><br>
//                 Your password has been successfully changed.`
//         });
//         res.json({success: true, message: 'Your password has been changed!'});
//       });
//   }      
  
      
// });


// router.post('/reset_password/', async (req, res) => {
//   const user = await User.findOne({email: req.body.email});

//   if (user) {
//     user.temporarytoken = user.generateAuthToken();
//     await user.save(async () => {
//       let info = await transporter.sendMail({
//       from: config.get('mail_user'), // sender address
//       to: user.email, // list of receivers
//       subject: "Hello, Please confirm your new password for OSFAcademy", // Subject line
//       text: `Hello ${user.name}. 
//             Please click on the link below to activate your new password:
//             href="http://localhost/users/reset_password/${user._id}`, // plain text body
//       html: `Hello <strong> ${user.name}</strong>. 
//             <br><br>
//             Please click on the link below to activate your new password::
//             <br><br>
//             <form action="http://localhost/users/reset_password/${user._id}" method="post">
//               <input name="token" value="${user.temporarytoken}" type="hidden"/>
//               <input name="password" value="${req.body.password}" type="hidden"/>
//               <button type="submit">Apply new password</button>
//             </form>`
//       });
//       return res.status(400).send('Letter has been sent for confirmation of your password change!');   
//     });

//   }
 
// });


// module.exports = router;

