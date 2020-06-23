const express = require('express');
const router = express.Router();

const adminMiddlewares = require('../middlewares/admin');
const adminControllers = require('../controllers/admin');

//General routes
router.post('/login', adminMiddlewares.dataEnteredToLogin, adminControllers.login);

//Products routes
router.get('/productos', adminMiddlewares.isAdmin, adminControllers.getProducts);
router.get('/producto/:id', adminMiddlewares.isAdmin, adminControllers.getProduct);
router.post('/producto', adminMiddlewares.isAdmin, adminControllers.postProduct);
router.put('/producto/:id', adminMiddlewares.isAdmin, adminControllers.updateProduct);
router.delete('/producto/eliminar/:id', adminMiddlewares.isAdmin, adminControllers.deleteProduct);

//Orders routes 
router.get('/pedidos', adminMiddlewares.isAdmin, adminControllers.getOrders);
router.get('/pedido/:id', adminMiddlewares.isAdmin, adminControllers.getOrderStatus);
router.put('/pedido', adminMiddlewares.isAdmin, adminControllers.updateState);

//Users routes
router.get('/usuarios', adminMiddlewares.isAdmin, adminControllers.getUsers);
router.get('/usuario/:usuario', adminMiddlewares.isAdmin, adminControllers.getUser);

module.exports = router;