const PokemonService = require('../services/pokemon.service');
const mongoose = require('mongoose');

// GET /api/pokemon/types
exports.getTypes = (req, res) => {
  const types = PokemonService.getAllTypes();
  res.status(200).json({
    data: types,
    count: types.length
  });
};

// POST /api/pokemon
// exports.createPokemon = async (req, res) => {
//   try {
//     // Récupère le body de la requête
//     const newPkmn = await PokemonService.createPokemon(req.body);
//     res.status(201).json(newPkmn);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// Créer un Pokémon
exports.createPokemon = async (req, res) => {
  try {
    const { name, imgUrl, description, types, regions } = req.body;

    if (await PokemonService.getPokemonByName(name)) {
      return res.status(400).json({ error: "Ce Pokémon existe déjà !" });
    }

    const newPokemon = await PokemonService.createPokemon({
      name,
      imgUrl,
      description,
      types,
      regions,
    });

    res.status(201).json(newPokemon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer tous les Pokémon
exports.getAllPokemon = async (req, res) => {
  try {
    const pokemons = await PokemonService.getAllPokemon();
    res.status(200).json(pokemons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer un Pokémon par ID
exports.getPokemonById = async (req, res) => {
  try {
    const pokemon = await PokemonService.getPokemonById(req.params.id);
    if (!pokemon) return res.status(404).json({ error: "Pokémon introuvable" });
    res.status(200).json(pokemon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour un Pokémon
exports.updatePokemon = async (req, res) => {
  try {
    const updatedPokemon = await PokemonService.updatePokemon(req.params.id, req.body);
    if (!updatedPokemon) return res.status(404).json({ error: "Pokémon introuvable" });
    res.status(200).json(updatedPokemon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer un Pokémon
exports.deletePokemon = async (req, res) => {
  try {
    const deletedPokemon = await PokemonService.deletePokemon(req.params.id);
    if (!deletedPokemon) return res.status(404).json({ error: "Pokémon introuvable" });
    res.status(200).json({ message: "Pokémon supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addRegion = async (req, res) => {
  try {
    const { pokemonId, regionName, regionPokedexNumber } = req.body;

    // Vérifier que tous les champs nécessaires sont fournis
    if (!pokemonId || !regionName || !regionPokedexNumber) {
      return res.status(400).json({ error: "Tous les champs (pokemonId, regionName, regionPokedexNumber) sont requis." });
    }

    // Récupérer le Pokémon
    const pokemon = await PokemonService.getPokemonById(pokemonId);
    if (!pokemon) {
      return res.status(404).json({ error: "Pokémon non trouvé." });
    }

    // Ajouter ou mettre à jour la région
    const updatedPokemon = await PokemonService.addRegionToPokemon(pokemon, regionName, regionPokedexNumber);

    res.status(200).json(updatedPokemon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.searchPokemons = async (req, res) => {
//   try {
//     let { page = 1, size = 10, typeOne, typeTwo, partialName } = req.query;

//     // Convertir les valeurs en nombres
//     page = parseInt(page, 10);
//     size = parseInt(size, 10);

//     // Construire le filtre de recherche
//     const filters = {};

//     if (typeOne) filters.types = typeOne;
//     if (typeTwo) filters.types = { $all: [typeOne, typeTwo] };
//     if (partialName) filters.name = new RegExp(partialName, 'i');

//     // Rechercher les Pokémon avec les filtres et pagination
//     const { pokemons, count } = await PokemonService.searchPokemons(filters, page, size);

//     res.status(200).json({ data: pokemons, count });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.searchPokemons = async (req, res) => {
  try {
    let { page = 1, size = 10, typeOne, typeTwo, partialName } = req.query;

    // Convertir en nombres
    page = parseInt(page, 10);
    size = parseInt(size, 10);

    // Construire le filtre
    const filters = {};
    if (typeOne) filters.types = typeOne;
    if (typeTwo) filters.types = { $all: [typeOne, typeTwo] };
    if (partialName) filters.name = new RegExp(partialName, 'i');

    console.log("Recherche avec filtres :", filters);

    // Vérifier si on récupère bien des données
    const { pokemons, count } = await PokemonService.searchPokemons(filters, page, size);
    console.log("Résultat trouvé :", pokemons);

    // Si aucun Pokémon trouvé, renvoyer un tableau vide
    if (!pokemons || pokemons.length === 0) {
      return res.status(200).json({ data: [], count: 0 });
    }

    res.status(200).json({ data: pokemons, count });
  } catch (err) {
    console.error("Erreur recherche Pokémon :", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getPokemonByIdOrName = async (req, res) => {
  try {
    const { id, name } = req.query;

    if (!id && !name) {
      return res.status(400).json({ error: "Vous devez fournir un id ou un name." });
    }

    let pokemon;

    if (id) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        pokemon = await PokemonService.getPokemonById(id);
      } else {
        return res.status(400).json({ error: "ID invalide" });
      }
    } else if (name) {
      pokemon = await PokemonService.getPokemonByName(name);
    }

    if (!pokemon) {
      return res.status(404).json({ error: "Pokémon introuvable." });
    }

    res.status(200).json(pokemon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePokemonByParams = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("ID reçu pour suppression:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("ID invalide détecté:", id);
      return res.status(400).json({ error: "ID invalide" });
    }

    const deletedPokemon = await PokemonService.deletePokemon(id);

    if (!deletedPokemon) {
      return res.status(404).json({ error: "Pokémon introuvable." });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error("Erreur lors de la suppression:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// exports.updatePokemon = async (req, res) => {
//   try {
//     const { id, typeOne, typeTwo, ...updateFields } = req.query;

//     if (!id) {
//       return res.status(400).json({ error: "L'ID du Pokémon est requis." });
//     }

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "ID invalide" });
//     }

//     // Gérer la mise à jour des types si fournis
//     if (typeOne || typeTwo) {
//       updateFields.types = typeTwo ? [typeOne, typeTwo] : [typeOne];
//     }

//     const updatedPokemon = await PokemonService.updatePokemon(id, updateFields);

//     if (!updatedPokemon) {
//       return res.status(404).json({ error: "Pokémon introuvable." });
//     }

//     res.status(200).json(updatedPokemon);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.removeRegionFromPokemon = async (req, res) => {
  try {
    console.log("Requête reçue avec paramètres:", req.params);

    const { pkmnID, regionName } = req.params;

    // Vérifier si les paramètres sont fournis
    if (!pkmnID || !regionName) {
      return res.status(400).json({ error: "L'ID du Pokémon et le nom de la région sont requis." });
    }

    await PokemonService.removeRegionFromPokemon(pkmnID, regionName);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
