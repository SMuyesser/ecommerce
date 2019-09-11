const express = require('express');
const router = express.Router();

const { requireSignIn } = require('../controllers/auth');
const { userById } = require('../controllers/user');


// method takes two arguments. route and method from controller
router.param('userById', userById);

module.exports = router;