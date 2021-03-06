const express = require('express');
const router = express.Router();

const { create, categoryById, read, update, remove, list } = require('../controllers/category');
const { requireSignIn, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.post('/category/create/:userId', requireSignIn, isAuth, isAdmin, create);
router.get('/category/:categoryId', read);
router.put('/category/:categoryId/:userId', requireSignIn, isAuth, isAdmin, update);
router.delete('/category/:categoryId/:userId', requireSignIn, isAuth, isAdmin, remove);
router.get('/categories', list);

// anytime there is an Id in parameter, this method fires
router.param('userId', userById);
router.param('categoryId', categoryById);

module.exports = router;