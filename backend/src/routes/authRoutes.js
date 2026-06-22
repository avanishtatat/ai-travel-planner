const express = require('express');
const router = express.Router();


const { registerUser, loginUser } = require('../controllers/authControllers.js');

const { registerValidator, loginValidator } = require('../validators/authValidator.js');

router.post('/register', registerValidator, registerUser);
router.post('/login', loginValidator, loginUser);


module.exports = router;