const express = require('express');
const rbacController = require('../controllers/rbacController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.post('/create', rbacController.create);
router.put('/update', rbacController.update);
router.delete('/delete', rbacController.delete);

module.exports = router;
