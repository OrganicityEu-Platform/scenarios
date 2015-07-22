// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();

var config = require('./config/config.js');

var port         = process.env.PORT || config.port;
var mongoose     = require('mongoose');        // MongoDB connector (http://mongoosejs.com)
var passport     = require('passport');        // authentication middleware (http://passportjs.org)
var flash        = require('connect-flash');   // storage for flash messages (https://github.com/jaredhanson/connect-flash)
var morgan       = require('morgan');          // HTTP request logger (https://github.com/expressjs/morgan)
var cookieParser = require('cookie-parser');   // parses cookies in the request (https://github.com/expressjs/cookie-parser)
var bodyParser   = require('body-parser');     // parses request bodies (json, raw, text, url-encoded forms, https://github.com/expressjs/body-parser)
var session      = require('express-session'); // server-side session-storage (NOT FOR PRODUCTION, https://github.com/expressjs/session)

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.use('/static', express.static('public'));
app.use('/views', express.static('views'));

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(session({ secret: 'organicityScenarioTool' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // passport stores login cookies in express session storage
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================

app.get('/', function(req, res) {
    res.render('index.ejs', {
        req_user : req.user
    });
});
app.use('/', require('./routes/auth')(app, passport));
app.use('/scenarios', require('./routes/scenarios')(passport));
app.use('/users', require('./routes/users')(passport));
app.get('/favicon.ico', function(req, res) {
  console.log('favicon');
  res.sendStatus(404);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.format({
      'text/html': function() {
  			res.render('error', {
  			  message  : err.message,
  			  error    : err,
  			  req_user : req.user
  			});
      },
      'application/json': function() {
          res.json(err);
      },
      'default': function() {
          res.send(406, 'Not Acceptable');
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
    res.format({
      'text/html': function() {
			res.render('error', {
			  message  : err.message,
			  error    : {},
			  req_user : req.user
			});
      },
      'application/json': function() {
          res.json({});
      },
      'default': function() {
          res.send(406, 'Not Acceptable');
      }
    });
});

// launch ======================================================================
app.listen(port);
console.log('App started on port ' + port);
