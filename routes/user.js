const express = require('express');
const router = express.Router();

const {sayHi} = require('../controllers/user');

// method takes two arguments. route and sayhi method from controller
router.get('', sayHi);

module.exports = router;