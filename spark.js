// NODETIME DATA LOGGING SUPPORT
if(process.env.NODETIME_ACCOUNT_KEY) {
  require('nodetime').profile({
    accountKey: process.env.NODETIME_ACCOUNT_KEY,
    appName: 'sparkcore'
  });
}

// MODULE DEPENDENCIES
var routes = require('./routes/routes');
var express = require('express')
  , http = require('http')
  //, https = require('https')
  , path = require('path');
var express = require("express");

//-------------------------------------------------------------
// Uncomment if you want to call the Spark API from the backend
// Also uncomment ", https = require('https')" above
//
// Usage:
//   api.digitalWrite(api.D0,api.HIGH);
//-------------------------------------------------------------
//var api = require('./public/js/sparkapi'); 

var app = express();

// All Environments
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger());
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routes
app.get('/', function(req, res) {
    // if user is not logged in, ask them to login
    if (typeof req.session.username === 'undefined') {
        res.render('home', { title: 'Spark API Node.js Wrapper © BDub Technologies '+ new Date().getFullYear() });
    }
    // if user is logged in already, take them straight to the items list
    else res.redirect('/items');
});
// Main Web App page
app.get('/', routes.home);
// Used to login
app.post('/', routes.home_post_handler);
// Used for self keep alive (to prevent idle timeout)
app.get('/ping', function(req, res){
    res.send(new Date());
});
// Show general pages
app.get('/page', routes.page);
// Handle logout route
app.get('/logout', function(req, res) {
    // delete the session variable
    delete req.session.username;
    // redirect user to homepage
    res.redirect('/');
});

// Port Setup
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Express Server started! Listening on " + port);
});

function Log (msg) {
  console.log(msg);
}

function startKeepAlive() {
    setInterval(function() {
        var options = {
            host: 'sparkcore.herokuapp.com',
            port: 80,
            path: '/ping'
        };
        http.get(options, function(res) {
            res.on('data', function(chunk) {
                try {
                    console.log("HEROKU RESPONSE: " + chunk);
                } catch (err) {
                    console.log(err.message);
                }
            });
        }).on('error', function(err) {
            console.log("Got error: " + err.message);
        });
    }, 20 * 60 * 1000);
}

setTimeout(function() {
    startKeepAlive();
    Log('>>> Spark Core - Web App Loaded!');
}, 1000);