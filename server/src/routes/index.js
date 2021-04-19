const express = require('express');

const router = express.Router();

// Middlewares.
const { authenticated, hasRoles } = require('../middlewares/auth');
const { uploadFile } = require('../middlewares/upload');

// Controllers.
const { register, login, validate } = require('../controllers/auth');
const {
  getUsers,
  deleteUser,
  updateSelf,
  getUser,
  getMostPopularPartners,
  getSelf,
  getPartners,
} = require('../controllers/user');
const {
  getProduct,
  getProducts,
  addProduct,
  getProductsByPartnerId,
  updateProduct,
  deleteProduct,
} = require('../controllers/product');
const {
  addOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByPartnerId,
  getMyOrders,
} = require('../controllers/order');

// Routes.
// Routes for auth.
router.post('/login', login);
router.post('/register', register);
router.get('/validate', authenticated, validate);

// Routs for user.
router.get('/user', authenticated, getSelf);
router.get('/user/:id', authenticated, getUser);
router.get('/users', authenticated, getUsers);
router.post('/partners', getPartners);
router.get('/partners/most', getMostPopularPartners);
router.patch('/user', authenticated, uploadFile('img'), updateSelf);
router.delete('/user/:id', authenticated, deleteUser);

// Routes for product.
router.get('/product/:id', getProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProductsByPartnerId);
router.post(
  '/product',
  authenticated,
  hasRoles(['partner']),
  uploadFile('img'),
  addProduct
);
router.patch(
  '/product/:id',
  authenticated,
  hasRoles(['partner']),
  uploadFile('img'),
  updateProduct
);
router.delete(
  '/product/:id',
  authenticated,
  hasRoles(['partner']),
  deleteProduct
);

// Routes for order.
router.get('/order/:id', authenticated, getOrderById);
router.get('/orders/:id', authenticated, getOrdersByPartnerId);
router.get('/my-orders', authenticated, getMyOrders);
router.post('/order', authenticated, addOrder);
router.patch('/order/:id', authenticated, updateOrder);
router.delete('/order/:id', authenticated, deleteOrder);

module.exports = router;
