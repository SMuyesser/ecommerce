const express = require('express');
const router = express.Router();

const { create, productById, read, remove, update, list, listRelated } = require('../controllers/product');
const { requireSignIn, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/product/:productId', read);
router.post('/product/create/:userId', requireSignIn, isAuth, isAdmin, create);
router.delete('/product/:productId/:userId', requireSignIn, isAuth, isAdmin, remove);
router.put('/product/:productId/:userId', requireSignIn, isAuth, isAdmin, update);
router.get('/product/related/:productId', listRelated);
router.get('/products', list);

// anytime there is userId in parameter, this method fires
router.param('userId', userById);
// anytime there is productId in param, this method fires
router.param('productId', productById);

module.exports = router;