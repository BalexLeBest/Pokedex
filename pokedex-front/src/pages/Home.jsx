import React, { useEffect, useState } from "react";
import { getAllPokemons, getPokemonById } from "../services/pokemonService";
import "../styles/main.css";

function PokemonDetailEmbedded({ pokemonId }) {
  const [pokemon, setPokemon] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPokemonById(pokemonId);
        setPokemon(data);
      } catch (err) {
        setError("Erreur lors du chargement du Pokémon.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pokemonId]);

  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!pokemon) return <p>Aucun Pokémon trouvé.</p>;

  return (
    <div style={{ padding: "10px", fontSize: "12px" }}>
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Image à gauche */}
        <img
          src={pokemon.imgUrl}
          alt={pokemon.name}
          width="60"
          style={{ border: "1px solid #ccc", borderRadius: "4px" }}
        />

        {/* Infos à droite */}
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: "0 0 5px" }}>{pokemon.name}</h3>
          <p style={{ margin: "5px 0" }}>{pokemon.description}</p>
          <p style={{ margin: "5px 0" }}>
            <strong>Types :</strong> {pokemon.types.join(", ")}
          </p>
        </div>
      </div>
      <p style={{ fontSize: "10px", textAlign: "center", marginTop: "8px" }}>
        (Appuie sur le bouton A/B pour revenir)
      </p>
    </div>
  );
}

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [showDetail, setShowDetail] = useState(false);

  const ITEM_HEIGHT = 40;

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const data = await getAllPokemons();
        setPokemons(data);
      } catch (error) {
        console.error("Erreur lors du chargement des Pokémon :", error);
      }
    };
    fetchPokemons();
  }, []);

  // --- Curseur vers le bas
  const handleDown = () => {
    if (pokemons.length === 0) return;
    if (selectedIndex < pokemons.length - 1) {
      const newSelected = selectedIndex + 1;
      if (selectedIndex < 2) {
        setSelectedIndex(newSelected);
      } else if (selectedIndex >= 2 && newSelected < pokemons.length - 2) {
        setSelectedIndex(newSelected);
        setScrollIndex(scrollIndex + 1);
      } else {
        setSelectedIndex(newSelected);
      }
    }
  };

  // --- Curseur vers le haut
  const handleUp = () => {
    if (pokemons.length === 0) return;
    if (selectedIndex > 0) {
      const newSelected = selectedIndex - 1;
      if (selectedIndex > 2 && selectedIndex <= pokemons.length - 2) {
        setSelectedIndex(newSelected);
        setScrollIndex(scrollIndex > 0 ? scrollIndex - 1 : 0);
      } else {
        setSelectedIndex(newSelected);
      }
    }
  };

  // --- Boutons flèches
  useEffect(() => {
    const upButton = document.querySelector(".cross_up");
    const downButton = document.querySelector(".cross_down");

    if (!upButton || !downButton) return;

    upButton.addEventListener("click", handleUp);
    downButton.addEventListener("click", handleDown);

    return () => {
      upButton.removeEventListener("click", handleUp);
      downButton.removeEventListener("click", handleDown);
    };
  }, [pokemons, selectedIndex, scrollIndex]);

  // --- Bouton AB => toggle detail
  const handleAB = () => {
    if (!pokemons[selectedIndex]) return;
    // Inverse la valeur de showDetail
    setShowDetail((prev) => !prev);
  };

  const listStyle = {
    transform: `translateY(-${scrollIndex * ITEM_HEIGHT}px)`,
    transition: "transform 0.2s ease-out",
  };

  if (pokemons.length === 0) return <p>Chargement des Pokémon...</p>;

  return (
    <div>
      {/* Bloc explicatif */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <h1>Page d’Accueil du Pokédex</h1>
        <p>
          Bienvenue sur le Pokédex en ligne ! Ici, vous pouvez consulter la
          liste complète des Pokémon, en apprendre plus sur eux, et même vous
          connecter pour les marquer comme vus ou capturés. En tant
          qu’administrateur, vous pouvez aussi ajouter de nouveaux Pokémon,
          mettre à jour leurs informations ou encore gérer leurs régions
          d’apparition.
        </p>
        <p>
          Ci-dessous, découvrez notre interface “Gameboy” interactive : vous
          pouvez naviguer dans la liste des Pokémon et afficher un aperçu
          détaillé en cliquant sur les boutons virtuels.
        </p>
        <hr style={{ width: "80%", margin: "20px auto" }} />
        <h2>Utilisation de la Gameboy</h2>
        <p>
          Utilisez la croix directionnelle (avec les boutons “haut” et “bas”)
          pour faire défiler la liste. Sélectionnez un Pokémon et appuyez sur le
          gros bouton “A/B” pour afficher/masquer sa fiche. Lorsque vous êtes en
          mode fiche, vous pouvez lire une description concise. Appuyez à
          nouveau sur “A/B” pour revenir à la liste.
        </p>
      </div>

      {/* La gameboy */}
      <div className="gameboy">
        <div className="screen-cont">
          <div className="power power-on"></div>
          <div className="screen">
            {/* Liste ou détail en fonction de showDetail */}
            {showDetail ? (
              <PokemonDetailEmbedded pokemonId={pokemons[selectedIndex]._id} />
            ) : (
              <div className="pokemon-list" style={listStyle}>
                {pokemons.map((pokemon, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={pokemon._id}
                      className={`pokemon-item ${isSelected ? "selected" : ""}`}
                      style={{ height: ITEM_HEIGHT }}
                    >
                      <span className="cursor">{isSelected ? "▶" : ""}</span>
                      <img
                        src={pokemon.imgUrl}
                        alt={pokemon.name}
                        className="pokemon-image"
                      />
                      <span className="pokemon-name">{pokemon.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="controls-cont">
          <div className="btn-direction">
            <div className="vertical">
              <div className="cross_up"></div>
              <div className="cross_down"></div>
            </div>
            <div className="horizontal"></div>
          </div>

          {/* .btn-AB -> clique pour ouvrir/fermer la vue détail */}
          <div className="btn-AB" onClick={handleAB}></div>

          <div className="btn-start-select"></div>
        </div>

        <div className="speakers"></div>
        <div className="on-off"></div>
        <div className="phones">phones</div>
      </div>
    </div>
  );
}
