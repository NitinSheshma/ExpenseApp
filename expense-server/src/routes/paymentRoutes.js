const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const paymentController = require('../controllers/paymentController');

router.use(authMiddleware.protect);

router.post(
  '/create-order',
  paymentController.createOrder
);

router.post(
  '/verify-order',
  paymentController.verifyOrder
);

module.exports = router;
