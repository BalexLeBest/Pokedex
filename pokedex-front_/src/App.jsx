import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";
import Home from "./pages/Home";
import PokemonList from "./pages/PokemonList";
import { isUserLoggedIn } from "./services/trainerService";
import AuthGuard from "./components/AuthGuard";
import SearchPokemon from "./pages/SearchPokemon";
import PokemonDetail from "./pages/PokemonDetail";
import CreatePokemon from "./pages/CreatePokemon";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(isUserLoggedIn());
  const [role, setRole] = useState(localStorage.getItem("role"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      if (isUserLoggedIn()) {
        setIsAuthenticated(true);
        setRole(localStorage.getItem("role"));
      } else {
        setIsAuthenticated(false);
        setRole(null);
        const protectedRoutes = ["/profile", "/create-pokemon"];
        if (protectedRoutes.includes(location.pathname)) {
          navigate("/login");
        }
      }
    };

    checkAuth();
  }, [location.pathname]);

  // Se déconnecter instantanément
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole(null);
    navigate("/");
  };

  return (
    <div>
      <nav style={{ display: "flex", gap: "1rem", marginBottom: "20px" }}>
        <Link to="/">Accueil</Link>
        {!isAuthenticated ? (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <Link to="/profile">Mon profil</Link>
            <a onClick={handleLogout} style={{ cursor: "pointer"}}>
              Logout
            </a>
            {role === "ADMIN" && <Link to="/create-pokemon">Créer un Pokémon</Link>}
          </>
        )}
        <Link to="/pokemon">Pokémon</Link>
        <Link to="/search">Recherche</Link>
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-pokemon" element={<CreatePokemon />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/pokemon" element={<PokemonList />} />
        <Route path="/search" element={<SearchPokemon />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
        <Route path="*" element={<div>Oops, cette page n'existe pas !</div>} />
      </Routes>
    </div>
  );
}


export default App;
