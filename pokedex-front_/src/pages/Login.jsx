import React, { useState } from "react";
import { loginTrainer } from "../services/trainerService";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);

    try {
      const data = await loginTrainer({ username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);
      window.location.href = "/profile";
    } catch (err) {
      setError(err.message || "Erreur de connexion. Vérifiez vos identifiants.");
    }
  }

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username</label>
          <input 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            required
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
        <button type="submit">Se connecter</button>
      </form>

      {error && <p style={{ color: "red" }}>Erreur: {error}</p>}
    </div>
  );
}
