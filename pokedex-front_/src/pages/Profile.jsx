import React, { useState, useEffect } from "react";
import {
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
} from "../services/trainerService";
import "../styles/profile.css";

export default function Profile() {
  const [trainer, setTrainer] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const data = await getMyProfile(token);
      setTrainer(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const updatedFields = {
        trainerName: trainer.trainerName,
        imgUrl: trainer.imgUrl,
      };

      const response = await updateMyProfile(token, updatedFields);
      setMessage(response.message);
      setTrainer(response.trainer);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  }

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible !"
      )
    ) {
      return;
    }

    try {
      const response = await deleteMyAccount(token);
      alert(response.message);

      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");

      window.location.href = "/login";
    } catch (err) {
      setError(err.message);
    }
  };

  if (!token) {
    return (
      <div className="profile-container">
        Vous devez être connecté pour voir votre profil.
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container" style={{ color: "red" }}>
        Erreur : {error}
      </div>
    );
  }

  if (!trainer) {
    return <div className="profile-container">Chargement du profil...</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Mon Profil</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}

      <img
        src={trainer.imgUrl || "https://via.placeholder.com/120"}
        alt="Avatar du Dresseur"
        className="profile-avatar"
      />

      <p className="profile-info">
        <strong>Nom d'utilisateur :</strong> {trainer.username}
      </p>

      {editMode ? (
        <form className="profile-form" onSubmit={handleUpdate}>
          <div>
            <label>Nom visible :</label>
            <input
              type="text"
              value={trainer.trainerName}
              onChange={(e) =>
                setTrainer({ ...trainer, trainerName: e.target.value })
              }
            />
          </div>

          <div>
            <label>URL de l'avatar :</label>
            <input
              type="text"
              value={trainer.imgUrl}
              onChange={(e) =>
                setTrainer({ ...trainer, imgUrl: e.target.value })
              }
            />
          </div>

          <button type="submit" className="profile-button edit">
            Sauvegarder
          </button>
          <button
            type="button"
            className="profile-button cancel"
            onClick={() => setEditMode(false)}
          >
            Annuler
          </button>
        </form>
      ) : (
        <div>
          <p className="profile-info">
            <strong>Nom visible :</strong> {trainer.trainerName}
          </p>
          <button
            onClick={() => setEditMode(true)}
            className="profile-button edit"
          >
            Modifier
          </button>
        </div>
      )}

      <p className="profile-info">
        <strong>Email :</strong> {trainer.email || "Non renseigné"}
      </p>
      <p className="profile-info">
        <strong>Rôle :</strong> {trainer.role}
      </p>

      <h3 className="profile-title">Pokémon vus</h3>
      {trainer.pkmnSeen.length > 0 ? (
        <ul className="pokemon-list">
          {trainer.pkmnSeen.map((pokemon, index) => (
            <li key={index}>{pokemon}</li>
          ))}
        </ul>
      ) : (
        <p className="profile-info">Vous n'avez vu aucun Pokémon.</p>
      )}

      <h3 className="profile-title">Pokémon capturés</h3>
      {trainer.pkmnCatch.length > 0 ? (
        <ul className="pokemon-list">
          {trainer.pkmnCatch.map((pokemon, index) => (
            <li key={index}>{pokemon}</li>
          ))}
        </ul>
      ) : (
        <p className="profile-info">Vous n'avez capturé aucun Pokémon.</p>
      )}

      <button onClick={handleDeleteAccount} className="profile-button delete">
        Supprimer mon compte
      </button>
    </div>
  );
}
