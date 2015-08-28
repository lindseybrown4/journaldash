var express = require('express'); 
var bodyParser = require('body-parser');
var session = require('express-session'); 
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var app = express(); 

app.use(session({secret: 'Random I am hungry'}))

app.use(passport.initialize()); 
app.use(passport.session()); 

passport.use(new FacebookStrategy({
	clientID:'480297828796194',
	clientSecret:'468712ded773351252862b3fd2429406',
	callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
	return done(null, profile);

}));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/me',
	failureRedirect: '/login'
}));

passport.serializeUser(function(user, done){
	done(null, user);
}); 

passport.deserializeUser(function(obj, done){
	done(null, obj); 
}); 

app.get('/me', function(req, res){
	res.send(JSON.stringify(req.user)); 
});

app.listen(3000, function(){
	console.log('app is working on port 3000')
}); 
