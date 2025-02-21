const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const TrainerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: function () {
      return this.role !== 'USER';
    }
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER'
  },
  imgUrl: {
    type: String,
    default: ''
  },
  trainerName: {
    type: String,
    required: function () {
      return this.role === 'USER';
    }
  },
  // http://localhost:3000/api/auth/login
  // {
    // "username": "AdminMaster",
    // "email": "admin@test.com",
    // "password": "admin123",
    // "role": "ADMIN"
  // }
  
  creationDate: {
    type: Date,
    default: Date.now
  },
  pkmnSeen: {
    type: [String],
    default: []
  },
  pkmnCatch: {
    type: [String],
    default: []
  }
});

// Hash du mot de passe avant enregistrement
TrainerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Trainer = mongoose.model('Trainer', TrainerSchema);
module.exports = Trainer;
