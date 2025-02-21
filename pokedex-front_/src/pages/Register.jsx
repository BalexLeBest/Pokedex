import React, { useState } from "react";
import { registerTrainer } from "../services/trainerService";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [trainerName, setTrainerName] = useState("");
  const [role, setRole] = useState("USER");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleRegister(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const data = await registerTrainer({
        username,
        email,
        password,
        role,
        trainerName,
      });
      setSuccess(data.message);
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nom du dresseur</label>
          <input
            value={trainerName}
            onChange={(e) => setTrainerName(e.target.value)}
            required
          />
        </div>
        <button type="submit">S’inscrire</button>
      </form>

      {error && (
        <p style={{ color: "red" }}>Erreur: {error.message || error}</p>
      )}
      {success && <p style={{ color: "green" }}>Succès: {success}</p>}
    </div>
  );
}
