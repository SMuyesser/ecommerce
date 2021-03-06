const express = require('express');
const router = express.Router();

const {userSignupValidator} = require("../validator");
const { signUp, signIn, signOut, requireSignIn } = require('../controllers/auth');

// method takes two arguments. route and method from controller
router.post('/signup', userSignupValidator, signUp);
router.post('/signin', signIn);
router.get('/signout', signOut);

module.exports = router;