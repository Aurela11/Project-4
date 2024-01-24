const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

router.post('/register', userController.registerUser);
router.get('/allUsers', userController.getAllUsers);
router.get('/:id', userController.getUserDetails);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
