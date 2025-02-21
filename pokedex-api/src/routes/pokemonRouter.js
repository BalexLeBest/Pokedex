const express = require('express');
const router = express.Router();
const pokemonController = require('../controllers/pokemon.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

/**
 * Obtenir la liste des types de Pokémon
 * GET /api/pokemon/types
 * Response: { data: [ "FIRE", "WATER", "GRASS", ... ], count: 18 }
 */
router.get('/types', pokemonController.getTypes);

/**
 * Créer un nouveau Pokémon (ADMIN seulement)
 * POST /api/pokemon
 * Body: { "name": "Pikachu", "imgUrl": "url", "description": "test", "types": ["ELECTRIC"] }
 * Response: { "_id": "...", "name": "Pikachu", ... }
 */
router.post('/', verifyToken, requireRole('ADMIN'), pokemonController.createPokemon);

/**
 * Obtenir la liste de tous les Pokémon
 * GET /api/pokemon
 * Response: [ { "_id": "...", "name": "Pikachu", ... }, { "_id": "...", "name": "Charmander", ... } ]
 */
router.get('/', pokemonController.getAllPokemon);

/**
 * Modifier un Pokémon (ADMIN seulement)
 * PUT /api/pokemon/:id
 * Body: { "name": "Raichu", "types": ["ELECTRIC"] }
 * Response: { "_id": "...", "name": "Raichu", ... }
 */
router.put('/:id', verifyToken, requireRole('ADMIN'), pokemonController.updatePokemon);


/**
 * Supprimer un Pokémon (ADMIN seulement)
 * DELETE /api/pokemon/:id
 * Example: DELETE /api/pokemon/67ae1316e78cdb3dbb9b9a5b
 * Response: { "message": "Pokémon supprimé avec succès" }
 */
router.delete('/:id', verifyToken, requireRole('ADMIN'), pokemonController.deletePokemon);

router.post('/pkmn', verifyToken, requireRole('ADMIN'), pokemonController.createPokemon);

/**
 * Ajouter une région à un Pokémon (ADMIN seulement)
 * POST /api/pokemon/pkmn/region
 * Body: { "pokemonId": "67ae1316e78cdb3dbb9b9a5b", "regionName": "Kanto", "regionPokedexNumber": 25 }
 * Response: { "_id": "...", "regions": [ { "regionName": "Kanto", "regionPokedexNumber": 25 } ] }
 */
router.post('/pkmn/region', verifyToken, requireRole('ADMIN'), pokemonController.addRegion);

/**
 * Rechercher des Pokémon avec filtres
 * GET /api/pokemon/pkmn/search
 * Query Params: ?page=1&size=10&typeOne=Fire&typeTwo=Flying&partialName=Char
 * Example: GET /api/pokemon/pkmn/search?page=1&size=10&typeOne=Fire&typeTwo=Flying&partialName=Char
 * Response: { "data": [ { "name": "Charizard", ... } ], "count": 1 }
 */
router.get('/pkmn/search', pokemonController.searchPokemons);

/**
 * Rechercher un Pokémon par ID ou Nom
 * GET /api/pokemon/pkmn
 * Query Params: ?id=67ae1316e78cdb3dbb9b9a5b OR ?name=Pikachu
 * Example: GET /api/pokemon/pkmn?id=67ae1316e78cdb3dbb9b9a5b
 * Example: GET /api/pokemon/pkmn?name=Pikachu
 * Response: { "_id": "...", "name": "Pikachu", ... }
 */
router.get('/pkmn', pokemonController.getPokemonByIdOrName);

/**
 * Rechercher un Pokémon par ID
 * GET /api/pokemon/:id
 * Example: GET /api/pokemon/67ae1316e78cdb3dbb9b9a5b
 * Response: { "_id": "...", "name": "Bulbasaur", ... }
 */
router.get('/:id', pokemonController.getPokemonById);

/**
 * Supprimer un Pokémon avec paramètres (ADMIN seulement)
 * DELETE /api/pokemon/pkmn/:id
 * Example: DELETE /api/pokemon/pkmn/67ae1316e78cdb3dbb9b9a5b
 * Response: 204 No Content
 */
router.delete('/pkmn/:id', verifyToken, requireRole('ADMIN'), pokemonController.deletePokemonByParams);

/**
 * Modifier un Pokémon via Query Params (ADMIN seulement)
 * PUT /api/pokemon/pkmn
 * Query Params: ?id=67ae1316e78cdb3dbb9b9a5b&typeOne=Fire&typeTwo=Flying
 * Example: PUT /api/pokemon/pkmn?id=67ae1316e78cdb3dbb9b9a5b&typeOne=Fire&typeTwo=Flying
 * Response: { "_id": "...", "name": "Charizard", "types": ["Fire", "Flying"] }
 */
router.put('/pkmn', verifyToken, requireRole('ADMIN'), pokemonController.updatePokemon);

/**
 * Supprimer une région d'un Pokémon (ADMIN seulement)
 * Query Params: ?pkmnID=67ae1316e78cdb3dbb9b9a5b&regionName=Kanto
 * Example: DELETE http://localhost:3000/api/pokemon/pkmn/region/67ae1316e78cdb3dbb9b9a5b/Kanto
 * Response: 204 No Content
 */
router.delete('/pkmn/region/:pkmnID/:regionName', verifyToken, requireRole('ADMIN'), pokemonController.removeRegionFromPokemon);

module.exports = router;
