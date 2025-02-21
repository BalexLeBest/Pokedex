const PkmnType = require('../models/pkmnType');
const Pokemon = require('../models/pokemon.model');
const mongoose = require('mongoose');
console.log("Type réel de l'ID reçu:", typeof pkmnID);


class PokemonService {

  static async getPokemonByName(name) {
    return await Pokemon.findOne({ name });
  }

  // Créer un Pokémon
  static async createPokemon(data) {
    return await Pokemon.create(data);
  }

  // Récupérer tous les Pokémon
  static async getAllPokemon() {
    return await Pokemon.find();
  }

  // Récupérer un Pokémon par ID
  static async getPokemonById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID invalide");
    }
    return await Pokemon.findById(id);
  }

  // Mettre à jour un Pokémon
  static async updatePokemon(id, updateData) {
    return await Pokemon.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  // Supprimer un Pokémon
  static async deletePokemon(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID invalide");
    }
    return await Pokemon.findByIdAndDelete(id);
  }


  static async addRegionToPokemon(pokemon, regionName, regionPokedexNumber) {
    // Vérifier si la région existe déjà
    const existingRegion = pokemon.regions.find(region => region.regionName === regionName);

    if (existingRegion) {
      // Mise à jour du numéro de Pokédex régional
      existingRegion.regionPokedexNumber = regionPokedexNumber;
    } else {
      // Ajout d'une nouvelle région
      pokemon.regions.push({ regionName, regionPokedexNumber });
    }

    // Sauvegarder les modifications
    return await pokemon.save();
  }

  static async searchPokemons(filters, page, size) {
    try {
      const offset = (page - 1) * size;

      // Trouver les Pokémon correspondant aux critères
      const pokemons = await Pokemon.find(filters).skip(offset).limit(size);

      // Compter le nombre total de Pokémon correspondants
      const count = await Pokemon.countDocuments(filters);

      return { pokemons, count };
    } catch (error) {
      throw error;
    }
  }
  static async removeRegionFromPokemon(pkmnID, regionName) {
    console.log("[Service] Paramètres reçus:", { pkmnID, regionName });

    if (!pkmnID) {
      throw new Error("pkmnID est undefined ! Vérifie ta requête.");
    }

    if (!mongoose.Types.ObjectId.isValid(pkmnID)) {
      console.error("ID invalide détecté:", pkmnID);
      throw new Error("ID invalide");
    }

    console.log("ID valide");

    try {
      const pokemon = await Pokemon.findById(pkmnID);
      if (!pokemon) {
        throw new Error("Pokémon non trouvé.");
      }

      console.log("Pokémon trouvé:", pokemon.name);

      const newRegions = pokemon.regions.filter(region => region.regionName !== regionName);

      if (newRegions.length === pokemon.regions.length) {
        throw new Error("La région spécifiée n'existe pas pour ce Pokémon.");
      }

      pokemon.regions = newRegions;
      await pokemon.save();

      console.log("Suppression réussie !");
      return pokemon;
    } catch (err) {
      console.error("Erreur dans la suppression de la région:", err.message);
      throw err;
    }
  }
}

module.exports = PokemonService;
