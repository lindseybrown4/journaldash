var express = require('express'); 

var app = express(); 
var path = require('path');
var cookieParser = require('cookie-parser'); 
var session = require('express-session');  
var config = require('./config/config.js'); 
var ConnectMongo = require('connect-mongo')(session);
var mongoose = require('mongoose').connect(config.dbURL);
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

 
var port = 3000; 

app.set('views', path.join(__dirname, 'views')); 
app.engine('html', require('hogan-express')); 
app.set('view engine', 'html'); 
app.use(express.static(path.join(__dirname, 'public')));  
app.use(cookieParser());


var env = process.env.NODE_ENV || 'development';
if(env === "developement") {
	app.use(session({secret: "config.sessionSecret"}));
} else {
	app.use(session({
		secret: config.sessionSecret,
		store: new ConnectMongo({
			mongoose_connection:mongoose.connections[0],
			stringify: true
		})
	}));
}

// <!-- JQUERY FOR SLIDING NAVIGATION -->   
// $(document).ready(function() {
//   $('a[href*=#]').each(function() {
//     if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
//     && location.hostname == this.hostname
//     && this.hash.replace(/#/,'') ) {
//       var $targetId = $(this.hash), $targetAnchor = $('[name=' + this.hash.slice(1) +']');
//       var $target = $targetId.length ? $targetId : $targetAnchor.length ? $targetAnchor : false;
//        if ($target) {
//          var targetOffset = $target.offset().top;

// <!-- JQUERY CLICK FUNCTION REMOVE AND ADD CLASS "ACTIVE" + SCROLL TO THE #DIV -->   
//          $(this).click(function() {
//             $("#nav li a").removeClass("active");
//             $(this).addClass('active');
//            $('html, body').animate({scrollTop: targetOffset}, 1000);
//            return false;
//          });
//       }
//     }
//   });
// });



app.use(passport.initialize()); 
app.use(passport.session()); 

require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose);

require('./routes/routes.js')(express, app, passport);

app.listen(port, function() {
	console.log('Journal Swift Working on Port ' + port);
	console.log('Mode: ' + env);
});