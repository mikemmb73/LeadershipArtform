var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var session = require('express-session')
var session = require('client-sessions')
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
dotenv.config();


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//pug compile
//const pug = require('pug');
//const compiledFunction = pug.compileFile('/views/test');

// function to check if the request is local
var isThisLocalhost = function (req){

    var ip = req.connection.remoteAddress;
    var host = req.get('host');

    return ip === "127.0.0.1" || ip === "::ffff:127.0.0.1" || ip === "::1" || host.indexOf("localhost") !== -1;
}

// set up http server
app.use((req, res, next) => {
  if (!isThisLocalhost(req)) {
    console.log("env: " + req.app.get('env'));
    console.log(req.headers['x-forwarded-proto']);
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    } else {
      return next();
    }
  } else {
    return next();
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//this enables the use of the session
app.use(session({
  cookieName: 'session',
  secret: 'lMQdwKOpWmmm04YrdlozHbkX3rYZZuoJKWQqe6JaVlQ3yp1VpeWwzYtuamR6MgD',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({secret:"Key", resave: false, saveUninitialized: false, cookie:{maxAge: 600000}}));
app.use(bodyParser.urlencoded({
    extended: true
}));


//app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
