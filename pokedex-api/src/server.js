const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors());

// Middlewares body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connexion Mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Mongo OK'))
  .catch((err) => console.error(err));

// Import routes
const pokemonRouter = require('./routes/pokemonRouter');
const trainerRouter = require('./routes/trainerRouter');
const authRouter = require('./routes/authRouter');

app.use('/api/pokemon', pokemonRouter);
app.use('/api/trainer', trainerRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.status(200).json({ message: "Bienvenue sur l'API Pokédex !" });
});

// Lancement
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
