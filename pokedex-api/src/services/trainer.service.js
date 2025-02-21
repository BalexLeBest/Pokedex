const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Trainer = require('../models/trainer.model');

class TrainerService {
  static async createTrainer(data) {
    try {
      return await Trainer.create(data);
    } catch (error) {
      throw error;
    }
  }

  static async getTrainerById(id) {
    return await Trainer.findById(id);
  }

  static async getTrainerByEmail(email) {
    return await Trainer.findOne({ email });
  }

  static async getTrainerByUsername(username) {
    return await Trainer.findOne({ username });
  }

  static async verifyPassword(enteredPassword, storedHashed) {
    return await bcrypt.compare(enteredPassword, storedHashed);
  }

  static generateToken(trainer) {
    return jwt.sign(
      { userId: trainer._id, role: trainer.role },
      process.env.TOKEN_SECRET,
      { expiresIn: '24h' }
    );
  }

  static async getAllTrainers() {
    return await Trainer.find({});
  }

  static async updateTrainer(id, updateData) {
    return await Trainer.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  static async deleteTrainer(id) {
    return await Trainer.findByIdAndDelete(id);
  }

  static async searchPokemons(filters, page, size) {
    try {
      const offset = (page - 1) * size;

      console.log("Service: recherche Pokémon avec filtres :", filters);

      const pokemons = await Pokemon.find(filters).skip(offset).limit(size);
      const count = await Pokemon.countDocuments(filters);

      console.log("Nombre total trouvé :", count);

      return { pokemons, count };
    } catch (error) {
      console.error("Erreur dans searchPokemons :", error.message);
      throw error;
    }
  }

  static async deleteTrainer(id) {
    return await Trainer.findByIdAndDelete(id);
  }
}

module.exports = TrainerService;
