const express = require('express');
const router = express.Router();
const {userSignupValidator} = require("../validator");

const { signup } = require('../controllers/user');

// method takes two arguments. route and method from controller
router.post('/signup', userSignupValidator, signup);

module.exports = router;