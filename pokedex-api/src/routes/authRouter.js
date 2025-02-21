const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Route pour s'inscrire (register)
router.post('/register', authController.register);

// Route pour se connecter (login)
router.post('/login', authController.login);

// Vérifier si l'utilisateur est connecté
router.get('/checkUser', authController.checkUser);

module.exports = router;
