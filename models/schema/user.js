var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var user = mongoose.Schema({
  uuid    : String,
  name    : String,
  gender  : String,
  roles : [String],
  avatar : String,
  local            : {
    email        : String,
    password     : String,
    passwordReset : {
      id : String,
      timestamp : Date
    }
  },
  facebook         : {
    id           : String,
    token        : String,
    email        : String,
    name         : String,
    displayName  : String
  },
  twitter          : {
    id           : String,
    token        : String,
    displayName  : String,
    username     : String
  },
  google           : {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  },
  github           : {
    id           : String,
    token        : String,
    username     : String,
    displayName  : String
  },
  disqus           : {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  }
});

// generate a hash
user.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checks if password is valid
user.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

user.methods.hasRole = function(roles) {
  for (var i = 0; i <= roles.length; i++) {
    var role = roles[i];
    if (this.roles.indexOf(role) >= 0) {
      return true;
    }
  }
  return false;
};

var User = mongoose.model('User', user);

module.exports = User;
