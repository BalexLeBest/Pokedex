import React, { useState } from "react";
import { searchPokemonByName } from "../services/pokemonService";
import { useNavigate } from "react-router-dom";

export default function SearchPokemon() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await searchPokemonByName(search);
      setResults(data.data);
    } catch (err) {
      setError("Erreur lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Rechercher un Pokémon</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nom du Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          required
        />
        <button type="submit">Rechercher</button>
      </form>

      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {results.length > 0 ? (
          results.map((pokemon) => (
            <li
              key={pokemon._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                padding: "10px",
                borderBottom: "1px solid #ddd",
              }}
              onClick={() => navigate(`/pokemon/${pokemon._id}`)}
            >
              <img src={pokemon.imgUrl} alt={pokemon.name} width="50" />
              <strong>{pokemon.name}</strong> - {pokemon.types.join(", ")}
            </li>
          ))
        ) : (
          <p>Aucun Pokémon trouvé</p>
        )}
      </ul>
    </div>
  );
}
