/*
 * Configurations for auths
 */

var config = require('../config/config');
var ui     = require('../ui_routes.js');

module.exports = {
  'facebookAuth' : {
    'clientID'         : '1639113973042055', // your App ID
    'clientSecret'     : 'd37b20984e357cc71867784c5d29cd5d', // your App Secret
    'callbackURL'      : config.host + ':' + config.port + ui.route('callback_facebook')
  },
  'twitterAuth' : {
    'consumerKey'      : '4rpDU6Z2gWFsX8rVMAuFLZDX7',
    'consumerSecret'   : 'UbvoVVuzUr6EOcgUNhsv9D3kod9oMvOFFwtFuA5vmyxfCKBTSh',
    'callbackURL'      : config.host + ':' + config.port + ui.route('callback_twitter')
  },
  'googleAuth' : {
    'clientID'         : '89215756602-8e9a0t2go3ha3gmkopo0r64loehuvh3h.apps.googleusercontent.com',
    'clientSecret'     : 'CFPuPZa7l6YMFBBhXqgsRFlO',
    'callbackURL'      : config.host + ':' + config.port + ui.route('callback_google')
  },
  'githubAuth' : {
    'clientID'         : '646b3c1643b20170b3bb',
    'clientSecret'     : '4117fc5d93c7e3e5065a01508f943758ba2f4365',
    'callbackURL'      : config.host + ':' + config.port + ui.route('callback_github')
  }
};
