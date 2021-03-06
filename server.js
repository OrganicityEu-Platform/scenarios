// lib dependencies ===========================================================
var express           = require('express');
var passport          = require('passport');
var flash             = require('connect-flash');
var morgan            = require('morgan');
var cookieParser      = require('cookie-parser');
var bodyParser        = require('body-parser');
var session           = require('express-session');
var expressListRoutes = require('express-list-routes');
var timers            = require('timers');
var CronJob           = require('cron').CronJob;
var findRemove        = require('find-remove');

// configuration ==============================================================
var app               = express();
var router            = express.Router();
var config            = require('./config/config.js');
var port              = process.env.PORT || config.port;
var ui                = require('./ui_routes.js');
var ev                = require('express-validation');

var server; // the server instance

var startServer = function(done) {

  require('./config/passport')(passport); // pass passport for configuration

  var deleteFiles = function() {
    // Delete all files older than one day
    var s = 24 * 60 * 60;
    var result = findRemove('tmp/', {age: {seconds: s}, files: '*.*'});
    //console.log('Deleted ' + Object.keys(result).length + ' files from tmp/');
  };

  // set up our express application
  if (app.get('env') !== 'test') {
    // log every request to the console
    app.use(morgan('dev'));

    // Call one, the server starts
    deleteFiles();

    // Run as cronjob
    // Should not be used within the tests, otherwise they neve stop
    new CronJob('0 0 0 * * *', deleteFiles, null, true, 'Europe/Berlin');
  }

  app.use(ui.asset('/tmp'),     express.static('tmp'));
  app.use(ui.asset('/static'),  express.static('public'));
  app.use(ui.asset('/uploads'), express.static('uploads'));

  app.use(cookieParser()); // read cookies (needed for auth)
  app.use(bodyParser.json({limit: '10mb'})); // get information from html forms
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

  // required for passport
  app.use(session({ secret: 'organicityScenarioTool' })); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session

  // routes =====================================================================
  var routes_scenarios     = require('./routes/api/v1/scenarios.js')(router, passport);
  var routes_ratings       = require('./routes/api/v1/ratings.js')(router, passport);
  var routes_feedback      = require('./routes/api/v1/feedback.js')(router, passport);
  var routes_reports       = require('./routes/api/v1/reports.js')(router, passport);
  var routes_auth          = require('./routes/api/v1/auth.js')(router, passport);
  var routes_users         = require('./routes/api/v1/users.js')(router, passport);
  var routes_error         = require('./routes/api/v1/error.js')(router, passport);
  var routes_sysinfo       = require('./routes/api/v1/sysinfo.js')(router, passport);
  var routes_questionnaire = require('./routes/api/v1/questionnaire.js')(router, passport);
  var routes_evaluations   = require('./routes/api/v1/evaluations.js')(router, passport);
  var routes_counter       = require('./routes/api/v1/counter.js')(router, passport);
  var routes_upload        = require('./routes/api/v1/upload.js')(router, passport);
  var routes_contactUs     = require('./routes/api/v1/contact.js')(router, passport);
  var routes_statistic     = require('./routes/api/v1/statistic.js')(router, passport);

  app.use(routes_scenarios);
  app.use(routes_reports);
  app.use(routes_ratings);
  app.use(routes_feedback);
  app.use(routes_statistic);
  app.use(routes_auth);
  app.use(routes_users);
  app.use(routes_error);
  app.use(routes_questionnaire);
  app.use(routes_evaluations);
  app.use(routes_counter);
  app.use(routes_upload);
  app.use(routes_contactUs);

  // serve all (other) requests to single-page-app contained in index.html
  var index = require('./index.js');
  var contextPath = config.contextPath;
  contextPath = contextPath.substr(0, 1) === '/' ? contextPath : '/' + contextPath;
  contextPath = contextPath.substr(contextPath.length - 1) === '/' ? contextPath + '?' : contextPath + '/?';
  var catchAllRoute = contextPath + '*';
  app.get(catchAllRoute, function(req, res) {
    res.status(200).send(index);
  });

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
    console.log('404 ', req.path);
  });

  // error handlers
  if (app.get('env') === 'development') {

    console.log('Starting server in development (or test) mode');

    // development error handler
    // will print stacktrace
    app.use(function(err, req, res, next) {

      console.log('Error', err);
      // specific for validation errors
      if (err instanceof ev.ValidationError) {
        console.log('ValidationError');
        return res.status(err.status).json(err);
      }

      if (!err.status || err.status === 500) {
        console.log(err.stack);
      }
      res.status(err.status || 500);
      res.format({
        'application/json': function() {
          res.json(err);
        },
        'default': function() {
          res.status(406).send('Not Acceptable');
        }
      });
    });

  } else {

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.format({
          'application/json': function() {
            res.json({});
          },
          'default': function() {
            res.send(406, 'Not Acceptable');
          }
        });
    });
  }

  // launch =====================================================================
  server = app.listen(port, function() {

    if (app.get('env') !== 'test') {
      console.log('Server started on ' + config.host + ':' + port + config.contextPath);
    }

    if (done) {
      done();
    }
  });

  return server;
};

var stopServer = function(done) {
  if (server) {
    if (app.get('env') !== 'test') {
      console.log('Stopping server');
    }
    server.close();
    server = null;
  }
  done();
};

module.exports = {
  start : startServer,
  stop : stopServer
};
