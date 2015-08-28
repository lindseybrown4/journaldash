var User = require('../models/user');
var Story = require('../models/story');
var config = require('../../config'); 


var secretKey = config.secretKey; 

var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {

	var token = jsonwebtoken.sign({
		_id: user._id, 
		name: user.name,
		username: user.username
	}, secretKey, {
		expiresInMinute: 1440
	});


	return token;

}

module.exports = function(app, express) {

	
	var api = express.Router(); 

	api.post('/signup', function(req, res) {

		var user = new User({
			name: req.body.name, 
			username: req.body.username,
			password: req.body.password
		});

		var token = createToken(user);
		user.save(function(err) {
			if(err) {
				res.send(err);
				return;
			}

			res.json({ 

				success: true,
				message: 'User had been created!',
				token: token

			});
		});
	});

	api.get('/users', function(req, res) {

		User.find({}, function(err, users) {
			if(err) {
				res.send(err);
				return;
			}
			res.json(users);
		});
});
	api.post('/login', function(req, res) {

		User.findOne({ 
			username: req.body.username
		}).select('name username password').exec(function(err, user) {

			if(err) throw err;

			if(!user) {

				res.send({ message: "User doesn't exist"});
			} else if(user){

				var validPassword = user.comparePassword(req.body.password);
				
				if(!validPassword) {
					res.send({ message: "Invalid Password" });
				} else {

					var token = createToken(user);

					res.json({
						success: true, 
						message: "Successful login!",
						token: token
					});
				}
			}
		});
	});

		api.use(function(req, res, next) {

			console.log("Somebody just came to our app!"); 

			var token = req.body.token || req.param('token') || req.headers['x-access-token']; 


			if(token) {

				jsonwebtoken.verify(token, secretKey, function(err, decoded) {

					if(err) {
						res.status(403).send({ success: false, message: "Failed to authenticate user" });
					} else {
						//
						req.decoded = decoded; 
						next(); 
					}
				});
			} else {
				res.status(403).send({success: false, message: "No Token Provided" });
			}
		}); 

			//Destintion B // provide a legitabate token

		// api.get('/', function(req, res){

		// 	res.json("Hello World");
		// }); 

api.route('/')

	.post(function(req, res) {
			var story = new Story({
				creator: req.decoded.id,
				content: req.body.content
			}); 

			story.save(function(err) {
				if(err) {
					res.send(err); 
					return
				}

				res.json({message: "New Story Created!"});

			});	

	})

	.get(function(req, res) {

		Story.find({ creator: req.decoded.id }, function(err, stories) {

			if(err) {

				res.send(err)
				return;
			}
			
			res.json(stories);
		});

	});

	api.get('/me', function(req, res) {
		res.json(req.decoded); 

	}); 

return api

}
