const express = require('express');
const router = express.Router();

const clientMiddlewarres = require('../middlewares/clients');
const clientControllers = require('../controllers/clients');

//General routes
router.post('/signup', clientMiddlewarres.dataValidation, clientMiddlewarres.userExistence, clientControllers.postUser);
router.post('/login', clientMiddlewarres.dataEnteredToLogin, clientControllers.login);

//Products routes
router.get('/productos', clientMiddlewarres.isLogged, clientControllers.getProducts);
router.get('/productos/favoritos', clientMiddlewarres.isLogged, clientControllers.getFavorites);

//Orders routes
router.post('/pedido', clientMiddlewarres.isLogged, clientControllers.postOrder);
router.get('/pedido/:id', clientMiddlewarres.isLogged, clientMiddlewarres.oderUserMatch, clientControllers.getOrderStatus);

module.exports = router;
