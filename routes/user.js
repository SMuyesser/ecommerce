const express = require('express');
const router = express.Router();

const { requireSignIn, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

// test route requiring authentication, current authenticated user, and admin
router.get('/secret/:userId', requireSignIn, isAuth, (req, res) => {
	res.json({
		user: req.profile
	});
});

// method takes two arguments. route and method from controller
router.param('userId', userById);

module.exports = router;