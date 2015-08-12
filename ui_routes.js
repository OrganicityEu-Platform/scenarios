var config   = require('./config/config.js');
var routes   = require('./routes.js');

var ui_routes = {

  'root'              : '/?',
  'home'              : '/?',

  // scenario routes
  'scenarioList'      : '/scenarios/?',
  'scenarioCreate'    : '/scenarios/new/?',
  'scenarioEdit'      : '/scenarios/edit/:uuid/?',
  'scenarioView'      : '/scenarios/:uuid/?',

  // authentication routes
  'profile'           : '/auth/profile/?',
  'login'             : '/auth/login/?',
  'logout'            : '/auth/logout/?',
  'local-login'       : '/auth/local-login/?',
  'signup'            : '/auth/signup/?',

  'sysinfo'           : '/sysinfo/?',
  'admin_userList'    : '/admin/users/?',
  'admin_userEdit'    : '/admin/users/:uuid/?'
};

module.exports = {
  route   : routes.route(config.contextPath, ui_routes, { relative : false }),
  reverse : routes.reverse(config.contextPath, ui_routes, { relative : false }),
  asset   : routes.asset(config.contextPath, { relative : false })
};
