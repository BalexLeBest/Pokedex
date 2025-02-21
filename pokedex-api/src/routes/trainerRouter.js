const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainer.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

/**
 * Récupérer son propre profil (authentification requise)
 * GET /api/trainer/me
 * Headers: { Authorization: Bearer <token> }
 * Response: { "_id": "...", "username": "AshKetchum", ... }
 */
router.get('/me', verifyToken, trainerController.getTrainer);

/**
 * Récupérer un dresseur par username
 * GET /api/trainer/username/:username
 * Example: GET /api/trainer/username/AshKetchum
 * Response: { "_id": "...", "username": "AshKetchum", ... }
 */
router.get('/username/:username', verifyToken, trainerController.getTrainerByUsername);

/**
 * Récupérer un dresseur par ID ou Email
 * GET /api/trainer/find/:id_or_email
 * Example: GET /api/trainer/find/65e0c265f52ffe0b2a171b5a
 * Example: GET /api/trainer/find/ash@pokedex.com
 * Response: { "_id": "...", "username": "AshKetchum", ... }
 */
router.get('/find/:id_or_email', verifyToken, trainerController.getTrainerByIdOrEmail);

/**
 * Récupérer la liste de tous les dresseurs (ADMIN uniquement)
 * GET /api/trainer
 * Headers: { Authorization: Bearer <admin_token> }
 * Response: [ { "_id": "...", "username": "AshKetchum", ... }, ... ]
 */
router.get('/', verifyToken, requireRole('ADMIN'), trainerController.getAllTrainers);

/**
 * Créer un dresseur
 * POST /api/trainer
 * Headers: { Authorization: Bearer <token> }
 * Body: { "username": "AshKetchum", "imgUrl": "url", "trainerName": "Ash" }
 * Response: { "message": "Dresseur créé avec succès", "trainer": { "_id": "...", "username": "AshKetchum", ... } }
 */
router.post('/', verifyToken, trainerController.createTrainer);

/**
 * Mettre à jour un dresseur (profil connecté uniquement)
 * PUT /api/trainer
 * Headers: { Authorization: Bearer <token> }
 * Body: { "trainerName": "Ash Ketchum", "pkmnSeen": ["Pikachu"], "pkmnCatch": ["Pikachu"] }
 * Response: { "message": "Dresseur mis à jour avec succès", "trainer": { "_id": "...", "username": "AshKetchum", ... } }
 */
router.put('/', verifyToken, trainerController.updateTrainer);

/**
 * Supprimer son propre compte
 * DELETE /api/trainer/me
 * Headers: { Authorization: Bearer <token> }
 * Response: { "message": "Votre compte a été supprimé avec succès." }
 */
router.delete('/me', verifyToken, trainerController.deleteOwnAccount);

/**
 * Supprimer un dresseur spécifique (ADMIN seulement)
 * DELETE /api/trainer/:trainerId
 * Headers: { Authorization: Bearer <admin_token> }
 * Example: DELETE /api/trainer/65e0c265f52ffe0b2a171b5a
 * Response: { "message": "Dresseur supprimé avec succès" }
 */
router.delete('/:trainerId', verifyToken, requireRole('ADMIN'), trainerController.deleteTrainer);

/**
 * Marquer un Pokémon comme vu ou capturé
 * POST /api/trainer/mark
 * Headers: { Authorization: Bearer <token> }
 * Body: { "pokemonName": "Pikachu", "isCaptured": true }
 * Response: { "message": "Pikachu ajouté à la liste capturée." }
 */
router.post('/mark', verifyToken, trainerController.markPokemon);

module.exports = router;
