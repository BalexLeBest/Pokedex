import axios from "axios";

const API_URL = "http://localhost:3000/api";

// ========================
// INSCRIPTION
// ========================
export async function registerTrainer({ username, email, password, role, trainerName }) {
    try {
        const response = await axios.post("http://localhost:3000/api/auth/register", {
            username,
            email,
            password,
            role,
            trainerName
        });
        return response.data;
    } catch (err) {
        throw err.response?.data?.error || "Erreur inconnue";
    }
}


// ========================
// CONNEXION
// ========================
export async function loginTrainer({ username, password }) {
    try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Identifiants incorrects.");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur de connexion:", error.message);
        throw error;
    }
}


// ========================
// RECUP PROFIL ACTUEL
// ========================
export async function getMyProfile(token) {
    try {
        const response = await axios.get(`${API_URL}/trainer/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (err) {
        throw err.response?.data?.error || "Erreur inconnue";
    }
}

// ========================
// UPDATE PROFIL
// ========================
export async function updateMyProfile(token, updatedFields) {
    try {
        const response = await axios.put(`${API_URL}/trainer`, updatedFields, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (err) {
        throw err.response?.data?.error || "Erreur inconnue";
    }
}


// ========================
// LOGOUT
// ========================
export function logoutTrainer() {
    localStorage.removeItem("token");
    // localStorage.removeItem("username");
}

// ========================
// IS LOGGED
// ========================
export function isUserLoggedIn() {
    const token = localStorage.getItem("token");
    return !!token;
}

// ========================
// MARQUER UN POKEMON
// ========================
export async function markPokemonAsSeenOrCaught(token, pokemonName, isCaptured) {
    try {
        const response = await fetch("http://localhost:3000/api/trainer/mark", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ pokemonName, isCaptured }),
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la mise à jour du Pokémon.");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur :", error);
        throw error;
    }
}


export async function getTrainerInfo(token) {
    try {
        const response = await fetch("http://localhost:3000/api/trainer/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des informations du dresseur.");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur :", error);
        throw error;
    }
}

export async function deleteMyAccount(token) {
    try {
        const response = await fetch("http://localhost:3000/api/trainer/me", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Vérifie que le token est bien ajouté
            },
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || "Erreur lors de la suppression du compte.");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur :", error);
        throw error;
    }
}
