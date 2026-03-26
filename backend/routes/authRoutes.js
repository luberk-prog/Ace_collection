const express = require('express');
const router = express.Router();
const { setupAdmin, login } = require('../controllers/authController');

router.post('/setup', setupAdmin);
router.post('/login', login);

module.exports = router;
