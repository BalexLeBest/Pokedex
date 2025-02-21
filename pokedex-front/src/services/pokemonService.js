const API_URL = "http://localhost:3000/api/pokemon";

// Récupérer tous les Pokémon
export const getAllPokemons = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des Pokémon.");
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur :", error);
    return [];
  }
};

export const searchPokemonByName = async (partialName) => {
  try {
    const response = await fetch(`${API_URL}/pkmn/search?partialName=${partialName}`);
    if (!response.ok) {
      throw new Error("Erreur lors de la recherche du Pokémon.");
    }
    return await response.json(); 
  } catch (error) {
    console.error("Erreur :", error);
    return { data: [], count: 0 };
  }
};

export const getPokemonById = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/pokemon/${id}`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du Pokémon.");
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur :", error);
    return null;
  }
};

// Créer un Pokémon (Admin uniquement)
export const createPokemon = async (token, newPokemon) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newPokemon),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la création du Pokémon.");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur :", error);
    throw error;
  }
};

// Modifier un Pokémon (Admin uniquement)
export const updatePokemon = async (token, id, updatedPokemon) => {
  try {
    console.log(" Données envoyées:", JSON.stringify(updatedPokemon));

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedPokemon),
    });

    if (!response.ok) {
      const errorResponse = await response.json(); // Récupère l'erreur backend
      console.error("Erreur backend:", errorResponse);
      throw new Error(errorResponse.error || "Erreur lors de la mise à jour du Pokémon.");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur :", error);
    throw error;
  }
};


// Supprimer un Pokémon (Admin uniquement)
export const deletePokemon = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression du Pokémon.");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur :", error);
    throw error;
  }
};

export const addRegionToPokemon = async (token, pokemonId, regionName, regionPokedexNumber) => {
  try {
    const response = await fetch("http://localhost:3000/api/pokemon/pkmn/region", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pokemonId,
        regionName,
        regionPokedexNumber,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur lors de l'ajout de la région.");
    }

    return await response.json(); // Retourne le Pokémon mis à jour
  } catch (error) {
    console.error("Erreur lors de l'ajout de la région :", error);
    throw error;
  }
};