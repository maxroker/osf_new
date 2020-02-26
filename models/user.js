const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const config = require('config');
const jwt = require('jsonwebtoken');


const userSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  active: {type: Boolean, default: false},
  temporarytoken: {type: String}
});

userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
  return token;
}

module.exports = mongoose.model('User', userSchema);










//old
// const mongoose = require('mongoose');
// const Joi = require('joi');
// const passwordComplexity = require('joi-password-complexity');

// // new
// var bcrypt = require('bcryptjs');



// const complexityOptions = {
//   min: 10,
//   max: 30,
//   lowerCase: 1,
//   upperCase: 1,
//   numeric: 1,
//   symbol: 1,
//   requirementCount: 2,
// }

// const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     minlength: 5,
//     maxlength: 255
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     match: emailPattern,
//     minlength: 5,
//     maxlength: 255
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 5,
//     maxlength: 1024
//   },
//   active: {
//     type: Boolean,
//     default: false
//   },
//   temporarytoken: {
//     type: String, 
//     required: true
//   },
//   isAdmin: {
//     type: Boolean,
//     default: false
//   }
// });

// userSchema.methods.generateAuthToken = function() {
//   const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
//   return token;
// }

// userSchema.methods.encryptPassword = function(password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
// };

// userSchema.methods.validPassword = function(password) {
//   return bcrypt.compareSync(password, this.password);
// };

// const User = mongoose.model('User', userSchema);


// function userValidation (user) {
//   const schema = {
//     name: Joi.string().min(5).max(255).required(),
//     email: Joi.string().min(5).max(255).required().email(),
//     password: Joi.string().min(5).max(1024).required()
//   }

//   return Joi.validate(user, schema);
// }

// function passwordValidation (password) {
//   const validPassword = passwordComplexity(complexityOptions).validate(password);

//   return validPassword;
// }


// module.exports.User = User;
// module.exports.userValidation = userValidation;
// module.exports.passwordValidation = passwordValidation;

