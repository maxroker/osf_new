const express = require('express');
const router = express.Router();

const { User, userValidation, passwordValidation } = require('../models/user');
const _ = require('underscore');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');


router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password'); //exclude password
  res.send(user);
})

router.post('/', async (req, res) => {
  const { error } = userValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const passwordError = passwordValidation(req.body.password).error;
  if (passwordError) {
    let errMessage = '';
    const details = passwordError.details;
    for (err in details) errMessage += 'Password ' + details[err].message + '\n';
    return res.status(400).send(errMessage);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered');

  user = await new User(_.pick(req.body, ['name', 'email', 'password']));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  // user = await new User({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password
  // });

  await user.save();

  const token = user.generateAuthToken();
  
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));

  // res.send({
  //   name: user.name,
  //   email: user.email
  // });
});


module.exports = router;