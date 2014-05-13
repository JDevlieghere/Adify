
/**
 * Module dependencies.
 */

// Core
var express = require('express');
var http = require('http');
var path = require('path');

// Middleware
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var morgan  = require('morgan');
var formidable = require('formidable');

// Routes
var routes = require('./routes');
var user = require('./routes/user');
var image = require('./routes/image');
var advertisement = require('./routes/advertisement');
var star = require('./routes/star');

// Passport
var passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy;

// Passport Twitter Login
passport.use(new TwitterStrategy({
        consumerKey: "Qs9JEJpB8WHtF6UWGddHQ",
        consumerSecret: "wtmUxnjghTbtpGeym90k2UfuJ105SXXFLNIaNyTeYSk",
        callbackURL: "http://adify.be/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
        user.findOrCreate(db, profile);
        done(null,profile);
    }
));

// Passport Facebook Login
passport.use(new FacebookStrategy({
        clientID: "560819290683305",
        clientSecret: "627d39f7ed36f5c06f734dfc3015324e",
        callbackURL: "http://adify.be/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        user.findOrCreate(db, profile);
        done(null,profile);
    }
));

// Serialize and Deserialize
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// MongoDB
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/adify", {native_parser:true});
var helper = mongo.helper;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cookieParser('mysecretstring'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(session({ secret: 'TERCES' }));
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

function auth(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.send(401);
}

/*
 * Front-End Routes
 */
app.get('/', routes.index);
app.get('/create', routes.index);
app.get('/me', routes.index);
app.get('/_=_', routes.index);
app.get('/starred', routes.index);
app.get('/welcome', routes.index);
app.get('/profile', routes.index);

/*
 * Authentication Routes
 */
app.get('/logout', routes.logout);

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/auth/twitter' }));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/auth/facebook' }));

/*
 *  REST API Routes
 */
app.get('/api/classifieds', advertisement.get(db));
app.post('/api/classifieds', auth, advertisement.post(db));
app.put('/api/classifieds/:id', auth, advertisement.put(db, helper));
app.delete('/api/classifieds/:id', auth, advertisement.delete(db, helper));

app.get('/api/classifieds/me', auth, advertisement.findByMe(db));

app.get('/api/stars', auth, star.get(db));
app.post('/api/stars', auth, star.post(db));
app.delete('/api/stars/:id', auth, star.delete(db, helper));

app.get('/api/profile', user.me(db));
app.put('/api/profile', auth, user.update(db));

// Images
app.post('/img/upload', image.upload(formidable));
app.get('/img', image.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
