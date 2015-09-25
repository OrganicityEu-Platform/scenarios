var config   = require('./config/config.js');
var routes   = require('./routes.js');

var prefixes = {
  'auth'           : '/api/v1/auth',
  'users'          : '/api/v1/users',
  'scenarios'      : '/api/v1/scenarios',
  'actors'         : '/api/v1/actors',
  'sectors'        : '/api/v1/sectors',
  'devices'        : '/api/v1/devices',
  'error'          : '/api/v1/error',
  'sysinfo'        : '/api/v1/sysinfo',
  'questionnaire'  : '/api/v1/questionnaire',
  'evaluations'    : '/api/v1/evaluations'
};

var api_routes = {

  // authentication routes
  'currentUser'          : prefixes.auth + '/currentUser',
  'local-login'          : prefixes.auth + '/local-login',
  'signup'               : prefixes.auth + '/signup',
  'auth_facebook'        : prefixes.auth + '/facebook',
  'auth_twitter'         : prefixes.auth + '/twitter',
  'auth_google'          : prefixes.auth + '/google',
  'auth_disqus'          : prefixes.auth + '/disqus',
  'auth_github'          : prefixes.auth + '/github',
  'connect_facebook'     : prefixes.auth + '/facebook',
  'connect_twitter'      : prefixes.auth + '/twitter',
  'connect_google'       : prefixes.auth + '/google',
  'connect_github'       : prefixes.auth + '/github',
  'connect_disqus'       : prefixes.auth + '/disqus',
  'connect_local-signup' : prefixes.auth + '/local',
  'login'                : prefixes.auth + '/login',
  'logout'               : prefixes.auth + '/logout',
  'callback_facebook'    : prefixes.auth + '/facebook/callback',
  'callback_twitter'     : prefixes.auth + '/twitter/callback',
  'callback_google'      : prefixes.auth + '/google/callback',
  'callback_github'      : prefixes.auth + '/github/callback',
  'callback_disqus'      : prefixes.auth + '/disqus/callback',

  // users routes
  'users'                : prefixes.users + '/?',
  'user_info'            : prefixes.users + '/info/:uuid/?',
  'user_by_uuid'         : prefixes.users + '/:uuid/?',
  'disconnect_local'     : prefixes.users + '/:uuid/unlink/local?',
  'disconnect_facebook'  : prefixes.users + '/:uuid/unlink/facebook?',
  'disconnect_twitter'   : prefixes.users + '/:uuid/unlink/twitter?',
  'disconnect_google'    : prefixes.users + '/:uuid/unlink/google?',
  'disconnect_github'    : prefixes.users + '/:uuid/unlink/github?',
  'disconnect_disqus'    : prefixes.users + '/:uuid/unlink/disqus?',

  // scenario routes
  'scenario_list'        : prefixes.scenarios + '/?',
  'scenario_by_uuid'     : prefixes.scenarios + '/:uuid/?',
  'actors_list'          : prefixes.actors + '/?',
  'sectors_list'         : prefixes.sectors + '/?',
  'devices_list'         : prefixes.devices + '/?',
  'related_by_uuid'      : prefixes.scenarios + '/related/:uuid/?',
  'discus_statistics'      : prefixes.scenarios + '/discus_statistics/:uuid/?',

  // erroring resource (for testing)
  'error'                : prefixes.error + '/?',

  // sysinfo routes
  'sysinfo'              : prefixes.sysinfo + '/?',

  // questionnaire routes
  'questionnaire'        : prefixes.questionnaire + '/?',

  // evaluations routes
  'evaluations_list'     : prefixes.evaluations + '/?',
  'evaluation_by_uuid'   : prefixes.evaluations + '/:uuid/?'
};

module.exports = {
  route   : routes.route(config.contextPath, api_routes, { relative : false }),
  reverse : routes.reverse(config.contextPath, api_routes, { relative : false }),
  asset   : routes.asset(config.contextPath, { relative : false })
};
