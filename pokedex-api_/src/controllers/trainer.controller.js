const TrainerService = require('../services/trainer.service');
const PokemonService = require('../services/pokemon.service');

// Créer un utilisateur
exports.createTrainer = async (req, res) => {
    try {
        const { username, imgUrl, trainerName } = req.body;

        // Vérifier si un dresseur est déjà lié à cet utilisateur
        const existingTrainer = await TrainerService.getTrainerByUsername(username);
        if (existingTrainer) {
            return res.status(400).json({ error: "Un dresseur existe déjà avec ce nom d'utilisateur." });
        }

        // Créer le dresseur
        const trainer = await TrainerService.createTrainer({
            username,
            imgUrl,
            trainerName,
            creationDate: new Date(),
            pkmnSeen: [],
            pkmnCatch: [],
            role: 'USER'
        });


        res.status(201).json({ message: "Dresseur créé avec succès", trainer });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Récupérer un utilisateur par ID ou Email
// exports.getTrainer = async (req, res) => {
//     try {
//         const { id_or_email } = req.params;

//         // On récupère soit par email, soit par ID
//         const user = id_or_email.includes('@')
//             ? await UserService.getUserByEmail(id_or_email)
//             : await UserService.getUserById(id_or_email);

//         if (!user) {
//             return res.status(404).json({ error: "Utilisateur non trouvé" });
//         }
//         if (user._id.toString() !== req.auth.userId) {
//             return res.status(403).json({ error: "Accès interdit : Ce n’est pas votre compte." });
//         }

//         // Si tout va bien, on renvoie l'utilisateur
//         res.status(200).json(user);

//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// };

exports.getTrainer = async (req, res) => {
    try {
        const trainer = await TrainerService.getTrainerById(req.auth.userId);

        if (!trainer) {
            return res.status(404).json({ error: "Dresseur introuvable." });
        }

        res.status(200).json(trainer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getTrainerByIdOrEmail = async (req, res) => {
    try {
        const { id_or_email } = req.params;

        if (!id_or_email) {
            return res.status(400).json({ error: "ID ou Email requis." });
        }

        const trainer = id_or_email.includes('@')
            ? await TrainerService.getTrainerByEmail(id_or_email)
            : await TrainerService.getTrainerById(id_or_email);

        if (!trainer) {
            return res.status(404).json({ error: "Dresseur introuvable." });
        }

        res.status(200).json(trainer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTrainerByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        const trainer = await TrainerService.getTrainerByUsername(username);

        if (!trainer) {
            return res.status(404).json({ error: "Dresseur introuvable." });
        }

        res.status(200).json(trainer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mettre à jour un utilisateur par ID
exports.updateTrainer = async (req, res) => {
    try {
        const updatedUser = await UserService.updateUser(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Supprimer un utilisateur par ID
exports.deleteTrainer = async (req, res) => {
    try {
        const { trainerId } = req.params;

        if (!trainerId) {
            return res.status(400).json({ error: "L'ID du dresseur est requis." });
        }

        const deletedTrainer = await TrainerService.deleteTrainer(trainerId);
        if (!deletedTrainer) {
            return res.status(404).json({ error: "Dresseur introuvable." });
        }

        res.status(200).json({ message: `Dresseur ${deletedTrainer.username} supprimé avec succès` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getAllTrainers = async (req, res) => {
    try {
        const trainers = await TrainerService.getAllTrainers();
        res.status(200).json(trainers);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateTrainer = async (req, res) => {
    try {
        const { username, imgUrl, trainerName, pkmnSeen, pkmnCatch } = req.body;
        const trainerId = req.auth.userId; // Récupération du dresseur connecté

        // Vérifier si le dresseur existe
        const existingTrainer = await TrainerService.getTrainerById(trainerId);
        if (!existingTrainer) {
            return res.status(404).json({ error: "Dresseur introuvable." });
        }

        // Mise à jour des champs si fournis
        const updatedFields = {};
        if (username) updatedFields.username = username;
        if (imgUrl) updatedFields.imgUrl = imgUrl;
        if (trainerName) updatedFields.trainerName = trainerName;
        if (pkmnSeen) updatedFields.pkmnSeen = pkmnSeen;
        if (pkmnCatch) updatedFields.pkmnCatch = pkmnCatch;

        const updatedTrainer = await TrainerService.updateTrainer(trainerId, updatedFields);

        res.status(200).json({ message: "Dresseur mis à jour avec succès", trainer: updatedTrainer });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.markPokemon = async (req, res) => {
    try {
        const { pokemonName, isCaptured } = req.body;
        const trainerId = req.auth.userId;

        if (!pokemonName) {
            return res.status(400).json({ error: "Le nom du Pokémon est requis." });
        }

        // Vérifier si le Pokémon existe
        const pokemon = await PokemonService.getPokemonByName(pokemonName);
        if (!pokemon) {
            return res.status(404).json({ error: "Pokémon introuvable." });
        }

        // Récupérer le dresseur
        const trainer = await TrainerService.getTrainerById(trainerId);
        if (!trainer) {
            return res.status(404).json({ error: "Dresseur introuvable." });
        }

        // Ajouter le Pokémon soit dans "vu" soit dans "capturé"
        if (isCaptured) {
            if (!trainer.pkmnCatch.includes(pokemonName)) {
                trainer.pkmnCatch.push(pokemonName);
                trainer.pkmnSeen = [...new Set([...trainer.pkmnSeen, pokemonName])]; // Ajouter aussi dans "vu"
            }
        } else {
            if (!trainer.pkmnSeen.includes(pokemonName)) {
                trainer.pkmnSeen.push(pokemonName);
            }
        }

        // Sauvegarde du dresseur
        await trainer.save();

        res.status(200).json({ message: `${pokemonName} ajouté à la liste ${isCaptured ? "capturée" : "vue"}.` });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOwnAccount = async (req, res) => {
    try {
      const trainerId = req.auth.userId; // On récupère l'ID du dresseur depuis le token
  
      const deletedTrainer = await TrainerService.deleteTrainer(trainerId);
      if (!deletedTrainer) {
        return res.status(404).json({ error: "Dresseur introuvable." });
      }
  
      res.status(200).json({ message: "Votre compte a été supprimé avec succès." });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  