const TrainerService = require('../services/trainer.service');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role, trainerName } = req.body;

    // Vérifier si l'utilisateur existe déjà
    if (await TrainerService.getTrainerByUsername(username)) {
      return res.status(400).json({ error: "Ce username est déjà pris." });
    }

    const trainer = await TrainerService.createTrainer({ username, email, password, role, trainerName });

    res.status(201).json({ message: "Dresseur enregistré avec succès !" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const trainer = await TrainerService.getTrainerByUsername(username);

    if (!trainer || !(await TrainerService.verifyPassword(password, trainer.password))) {
      return res.status(400).json({ error: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    const token = TrainerService.generateToken(trainer);

    res.status(200).json({
      userId: trainer._id,
      username: trainer.username,
      role: trainer.role,
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkUser = (req, res) => {
  res.sendStatus(204);
};
