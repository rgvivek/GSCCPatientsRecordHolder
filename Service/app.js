var express = require('express');
var bodyparser = require('body-parser');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var connection = require('./connection');
var routes = require('./routes');
var config = require('./config');

var app = express();
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
//app.use(session({ secret: 'ilovegunamsiddhacurecenter' })); // session secret
connection.init();
app.set('superSecret', config.secret);
require('./passport')(passport);
routes.configure(app, passport);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
  next();
});

var server = app.listen(8000, function() {
  console.log('Server listening on port ' + server.address().port);
});
