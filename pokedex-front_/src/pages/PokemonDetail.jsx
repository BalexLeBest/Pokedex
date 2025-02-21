import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPokemonById,
  updatePokemon,
  deletePokemon,
  addRegionToPokemon,
} from "../services/pokemonService";
import {
  markPokemonAsSeenOrCaught,
  getMyProfile,
} from "../services/trainerService";

export default function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // States pour le Pokémon et son affichage
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // States pour l'édition (admin)
  const [editMode, setEditMode] = useState(false);
  const [editedPokemon, setEditedPokemon] = useState({});

  // States pour le dresseur
  const [trainer, setTrainer] = useState(null);

  // Récupération du token et du rôle dans le localStorage
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [regionName, setRegionName] = useState("");
  const [regionPokedexNumber, setRegionPokedexNumber] = useState("");
  const [editRegionIndex, setEditRegionIndex] = useState(null);

  // handleAddRegion
  const handleAddRegion = async (e) => {
    e.preventDefault();
    try {
      if (!regionName || !regionPokedexNumber) {
        setMessage("Merci de remplir tous les champs pour la région.");
        return;
      }
      const updatedPokemon = await addRegionToPokemon(
        token,
        pokemon._id,
        regionName,
        parseInt(regionPokedexNumber, 10)
      );
      setPokemon(updatedPokemon);
      setMessage("Région ajoutée / mise à jour avec succès !");
    } catch (err) {
      setMessage("Erreur lors de l'ajout / mise à jour de la région.");
    }
  };

  // Récupération du Pokémon et du profil
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const data = await getPokemonById(id);
        setPokemon(data);
        setEditedPokemon(data);
      } catch (err) {
        setError("Erreur lors du chargement du Pokémon.");
      } finally {
        setLoading(false);
      }
    };

    const fetchTrainer = async () => {
      if (!token) return;
      try {
        const trainerData = await getMyProfile(token);
        setTrainer(trainerData);
      } catch (err) {
        console.error("Erreur lors du chargement du profil :", err);
      }
    };

    fetchPokemon();
    fetchTrainer();
  }, [id, token]);

  // Détermine si le Pokémon est déjà vu/capturé
  const isSeen = trainer?.pkmnSeen.includes(pokemon?.name);
  const isCaught = trainer?.pkmnCatch.includes(pokemon?.name);

  // Marquer un Pokémon (vu ou capturé)
  const handleMarkPokemon = async (isCaptured) => {
    if (!token) {
      setMessage("Vous devez être connecté pour marquer un Pokémon.");
      return;
    }

    try {
      const response = await markPokemonAsSeenOrCaught(
        token,
        pokemon.name,
        isCaptured
      );
      setMessage(response.message);

      // Mettre à jour le profil pour un rafraîchissement immédiat de l'affichage
      const updatedTrainer = await getMyProfile(token);
      setTrainer(updatedTrainer);
    } catch (err) {
      setMessage("Erreur lors de la mise à jour.");
    }
  };

  // Supprimer un Pokémon (ADMIN)
  const handleDeletePokemon = async () => {
    if (!window.confirm(`Confirmer la suppression de ${pokemon.name} ?`))
      return;

    try {
      await deletePokemon(token, id);
      setMessage(`${pokemon.name} supprimé avec succès !`);
      setTimeout(() => navigate("/pokemon"), 2000);
    } catch (err) {
      setMessage("Erreur lors de la suppression.");
    }
  };

  // Mettre à jour un Pokémon (ADMIN)
  const handleUpdatePokemon = async () => {
    try {
      await updatePokemon(token, id, editedPokemon);
      setPokemon(editedPokemon);
      setMessage("Pokémon mis à jour !");
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la mise à jour.");
    }
  };

  // lire le nom du Pokémon
  const speakPokemonName = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(pokemon.name);
      utterance.lang = "fr-FR";
      speechSynthesis.speak(utterance);
    } else {
      alert("Votre navigateur ne supporte pas la lecture vocale.");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!pokemon) return <p>Aucun Pokémon trouvé.</p>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* Nom du Pokémon + Bouton vocal */}
      <h1>
        {editMode ? (
          <input
            type="text"
            value={editedPokemon.name}
            onChange={(e) =>
              setEditedPokemon({ ...editedPokemon, name: e.target.value })
            }
          />
        ) : (
          pokemon.name
        )}
        <button onClick={speakPokemonName} style={{ marginLeft: "10px" }}>
          Écouter
        </button>
      </h1>

      {/* Image */}
      <img src={pokemon.imgUrl} alt={pokemon.name} width="150" />

      {pokemon.regions && pokemon.regions.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Région</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {pokemon.regions.map((region, idx) => (
              <li key={idx} style={{ marginBottom: "10px" }}>
                {editMode ? (
                  <>
                    {/* Champ nom de la région */}
                    <input
                      type="text"
                      value={region.regionName}
                      onChange={(e) => {
                        // Modifie directement la région dans le state local "pokemon"
                        const newRegions = [...pokemon.regions];
                        newRegions[idx].regionName = e.target.value;
                        setPokemon({ ...pokemon, regions: newRegions });
                      }}
                      style={{ marginRight: "10px" }}
                    />
                    {/* Champ numéro régional */}
                    <input
                      type="number"
                      value={region.regionPokedexNumber}
                      onChange={(e) => {
                        const newRegions = [...pokemon.regions];
                        newRegions[idx].regionPokedexNumber =
                          parseInt(e.target.value, 10) || 0;
                        setPokemon({ ...pokemon, regions: newRegions });
                      }}
                      style={{ width: "80px" }}
                    />
                  </>
                ) : (
                  <>
                    <strong>{region.regionName}</strong> – n°
                    {region.regionPokedexNumber}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Indicateur Vu / Capturé / Pas découvert */}
      <p
        style={{
          fontWeight: "bold",
          fontSize: "1.1em",
          color: isCaught ? "green" : isSeen ? "orange" : "gray",
        }}
      >
        {isCaught ? "Capturé !" : isSeen ? "Vu !" : "Pas encore découvert"}
      </p>

      {/* Description (affiché si admin OU user ayant vu le Pokémon) */}
      {role === "ADMIN" || (token && isSeen) ? (
        <p>
          <strong>Description :</strong>{" "}
          {editMode ? (
            <input
              type="text"
              value={editedPokemon.description}
              onChange={(e) =>
                setEditedPokemon({
                  ...editedPokemon,
                  description: e.target.value,
                })
              }
            />
          ) : (
            pokemon.description
          )}
        </p>
      ) : (
        <p style={{ color: "gray" }}>
          Vous devez être connecté et avoir vu ce Pokémon pour voir sa
          description.
        </p>
      )}

      {/* Types (affiché si admin OU user ayant capturé le Pokémon) */}
      {(role === "ADMIN" || isCaught) && (
        <p>
          <strong>Type(s) :</strong>{" "}
          {editMode ? (
            <input
              type="text"
              value={editedPokemon.types.join(", ")}
              onChange={(e) =>
                setEditedPokemon({
                  ...editedPokemon,
                  types: e.target.value
                    .split(",")
                    .map((t) => t.trim().toUpperCase()),
                })
              }
            />
          ) : (
            pokemon.types.join(", ")
          )}
        </p>
      )}

      {/* Boutons Admin (modifier / supprimer) */}
      {role === "ADMIN" && (
        <div style={{ marginTop: "20px" }}>
          {!editMode ? (
            // Bouton "Modifier"
            <button onClick={() => setEditMode(true)}>Modifier</button>
          ) : (
            <>
              {/* Bouton "Sauvegarder" */}
              <button
                onClick={async () => {
                  try {
                    await handleUpdatePokemon();
                    for (const region of pokemon.regions) {
                      await addRegionToPokemon(
                        token,
                        pokemon._id,
                        region.regionName,
                        region.regionPokedexNumber
                      );
                    }
                    setMessage("Modifications enregistrées !");
                  } catch (err) {
                    console.error(err);
                    setMessage("Erreur lors de la mise à jour.");
                  } finally {
                    setEditMode(false);
                  }
                }}
              >
                Sauvegarder
              </button>

              {/* Bouton "Annuler" */}
              <button
                onClick={() => {
                  // Annuler : rétablir la version initiale
                  setPokemon(editedPokemon);
                  setEditMode(false);
                }}
                style={{ backgroundColor: "gray", marginLeft: "10px" }}
              >
                Annuler
              </button>
            </>
          )}
          {/* Bouton "Supprimer" */}
          <button
            onClick={handleDeletePokemon}
            style={{
              backgroundColor: "red",
              color: "white",
              marginLeft: "10px",
            }}
          >
            Supprimer
          </button>
        </div>
      )}

      {/* Boutons pour marquer comme vu / capturé (toujours autorisés si user a un token) */}
      {token ? (
        <>
          <button
            onClick={() => handleMarkPokemon(false)}
            disabled={isSeen}
            style={{
              backgroundColor: isSeen ? "gray" : "orange",
              cursor: isSeen ? "not-allowed" : "pointer",
              marginTop: "20px",
            }}
          >
            {isSeen ? "Déjà vu" : "Marquer comme vu"}
          </button>
          <button
            onClick={() => handleMarkPokemon(true)}
            disabled={isCaught}
            style={{
              backgroundColor: isCaught ? "gray" : "green",
              cursor: isCaught ? "not-allowed" : "pointer",
              marginLeft: "10px",
              marginTop: "20px",
            }}
          >
            {isCaught ? "Déjà capturé" : "Marquer comme capturé"}
          </button>
        </>
      ) : (
        <p style={{ color: "orange" }}>
          Vous devez être connecté pour marquer ce Pokémon !
        </p>
      )}

      {/* Message éventuel (erreur ou succès) */}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* Bouton retour */}
      <button onClick={() => navigate(-1)} style={{ marginTop: "20px" }}>
        Retour
      </button>
    </div>
  );
}
