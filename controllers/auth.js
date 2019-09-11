const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to generate signed web token
const expressJwt = require('express-jwt'); // used for authorization check
const {errorHandler} = require('../helpers/dbErrorHandler');

// sign up user
exports.signUp = (req, res) => {
	// console.log('req.body', req.body);
	const user = new User(req.body);
	user.save((err, user) => {
		if(err) {
			return res.status(400).json({
				err: errorHandler(err)
			});
		}
		user.salt = undefined;
		user.hashed_password = undefined;
		res.json({
			user
		});
	});
};

// sign in user
exports.signIn = (req, res) => {
	// find used based on email
	const {email, password} = req.body;
	User.findOne({email}, (err, user) => {
		if(err || !user) {
			return res.status(400).json({
				error: 'User with that email does not exist'
			});
		}
		// If uses is found, make sure email and password match
		// create authenticate method in user model
		if(!user.authenticate(password)) {
			return res.status(401).json({
				error: "Email and password don't match"
			})
		}
		// generate a signed token with user id and secret
		const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
		// persist the token as 't' in cookie with expiry date
		res.cookie('t', {expire: new Date() + 9999});
		// return response with user and token to frontend client
		const {_id, name, email, role} = user;
		return res.json({token, user: {_id, name, email, role}});
	})
};

// sign out by removing cookie from response
exports.signOut = (req, res) => {
	res.clearCookie('t');
	res.json({message: 'Signout success'});
};

// protected routes requires you to be signed in
exports.requireSignIn = expressJwt({
	secret: process.env.JWT_SECRET,
	userProperty: "auth"
});

// if we have user that is true with the comparison
// if not true return status unauthorized
exports.isAuth = (req, res, next) => {
	let user = req.profile && req.auth && req.profile._id == req.auth._id;
	if (!user) {
		return res.status(403).json({
			error: "Access denied"
		});
	}
	next();
};

// admin role is 1 so if role equals 0, not admin
exports.isAdmin = (req, res, next) => {
	console.log("isadminisadminisadminisadminisadmin");
	if(req.profile.role === 0) {
		return res.status(403).json({
			error: "Admin resource! Access denied"
		});
	} 
	next();
};