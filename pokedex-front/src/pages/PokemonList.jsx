import React, { useEffect, useState } from "react";
import { getAllPokemons } from "../services/pokemonService";
import { Link } from "react-router-dom";

const PokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemons = async () => {
      const data = await getAllPokemons();
      setPokemons(data);
      setLoading(false);
    };

    fetchPokemons();
  }, []);

  if (loading) {
    return <p>Chargement des Pokémon...</p>;
  }

  return (
    <div>
      <h2>Liste des Pokémon</h2>
      <ul>
        {pokemons.map((pokemon) => (
          <li
            key={pokemon._id}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <img src={pokemon.imgUrl} alt={pokemon.name} width="50" />
            <Link
              to={`/pokemon/${pokemon._id}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              <strong>{pokemon.name}</strong> - {pokemon.types.join(", ")}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonList;
