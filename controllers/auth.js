const express = require('express');
const router = express.Router();
const _ = require('underscore');

const Joi = require('joi');
const jwt = require('jsonwebtoken');

const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const config = require('config');

function userValidation (req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required()
  }

  return Joi.validate(req, schema);
}


router.post('/', async (req, res) => {
  let prevUrl = req.headers.referer;

  // console.log(req.headers.referer);
  const { error } = userValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  res.cookie('x-auth-token', token);
  // res.render("home", { 
  //   _: _, 
  //   title: '',
  //   active_tab: '',
  //   token: token
  //   // categories: categories
  // }); 
  res.redirect('back');

});


module.exports = router;