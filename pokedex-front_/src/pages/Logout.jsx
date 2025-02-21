import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutTrainer } from "../services/trainerService";

export default function Lougout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.reload();
  };

  return (
    <nav>
      <h1>Voulez vous vous déconnecter ?</h1>
      <button onClick={handleLogout}>Se Déconnecter</button>
    </nav>
  );
}
