const express = require('express');
const router = express.Router();

const { create, productById, read, remove, update, list, listRelated, listCategories, listBySearch, photo } = require('../controllers/product');
const { requireSignIn, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/product/:productId', read);
router.post('/product/create/:userId', requireSignIn, isAuth, isAdmin, create);
router.delete('/product/:productId/:userId', requireSignIn, isAuth, isAdmin, remove);
router.put('/product/:productId/:userId', requireSignIn, isAuth, isAdmin, update);
router.post('/products/by/search', listBySearch);
router.get('/product/photo/:productId', photo);
router.get('/products', list);
router.get('/products/categories', listCategories);
router.get('/products/related/:productId', listRelated);

// anytime there is userId in parameter, this method fires
router.param('userId', userById);
// anytime there is productId in param, this method fires
router.param('productId', productById);

module.exports = router;