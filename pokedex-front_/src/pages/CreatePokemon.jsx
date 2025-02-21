import React, { useState } from "react";
import { createPokemon } from "../services/pokemonService";
import { useNavigate } from "react-router-dom";

export default function CreatePokemon() {
  const [name, setName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [description, setDescription] = useState("");
  const [types, setTypes] = useState("");

  const [regionName, setRegionName] = useState("");
  const [regionPokedexNumber, setRegionPokedexNumber] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (role !== "ADMIN") {
    return (
      <p style={{ color: "red" }}>
        Accès refusé. Seuls les admins peuvent créer un Pokémon.
      </p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formattedTypes = types.split(",").map((t) => t.trim().toUpperCase());

    try {
      const newPokemonData = {
        name,
        imgUrl,
        description,
        types: formattedTypes,
        regions: [
          {
            regionName,
            regionPokedexNumber: parseInt(regionPokedexNumber, 10),
          },
        ],
      };

      await createPokemon(token, newPokemonData);
      setSuccess("Pokémon créé avec succès !");
      setTimeout(() => navigate("/pokemon"), 2000);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div>
      <h2>Créer un Pokémon</h2>

      {error && <p style={{ color: "red" }}>Erreur: {error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom :</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Image URL :</label>
          <input
            type="text"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description :</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Types (séparés par une virgule) :</label>
          <input
            type="text"
            value={types}
            onChange={(e) => setTypes(e.target.value)}
            required
          />
          <p>Exemple : FIRE, ELECTRIC</p>
        </div>

        <div>
          <label>Nom de la région :</label>
          <input
            type="text"
            value={regionName}
            onChange={(e) => setRegionName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Numéro Pokédex régional :</label>
          <input
            type="number"
            value={regionPokedexNumber}
            onChange={(e) => setRegionPokedexNumber(e.target.value)}
            required
          />
        </div>

        <button type="submit">Créer</button>
      </form>

      <button
        onClick={() => navigate("/pokemon")}
        style={{ marginTop: "10px" }}
      >
        Retour
      </button>
    </div>
  );
}
