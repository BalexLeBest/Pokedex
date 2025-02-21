const mongoose = require('mongoose');

const PokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  imgUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  types: {
    type: [String], // Tableau contenant 1 ou 2 types
    required: true,
    validate: [arrayLimit, 'Un Pokémon doit avoir entre 1 et 2 types']
  },
  regions: [{
    regionName: String,
    regionPokedexNumber: Number
  }]
});

// Fonction pour limiter à 2 types max
function arrayLimit(val) {
  return val.length > 0 && val.length <= 2;
}

const Pokemon = mongoose.model('Pokemon', PokemonSchema);
module.exports = Pokemon;
