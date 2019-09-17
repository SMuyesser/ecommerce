const express = require('express');
const router = express.Router();

const { create, categoryById, read } = require('../controllers/category');
const { requireSignIn, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.post('/category/create/:userId', requireSignIn, isAuth, isAdmin, create);
router.get('/category/:categoryId', read);

// anytime there is an Id in parameter, this method fires
router.param('userId', userById);
router.param('categoryId', categoryById);

module.exports = router;