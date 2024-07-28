require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const registerUser = require('./auth/auth-service');
const User = require('./models/User');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB', err));

// Middleware za proveru autentifikacije
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Ruta za registraciju korisnika
app.post('/register', async (req, res) => {
  try {
    const newUser = await registerUser(req.body);
    res.status(201).json({ message: 'Korisnik uspešno kreiran. Proverite email za verifikaciju.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta za verifikaciju emaila
app.get('/verify-email', async (req, res) => {
    try {
      const token = req.query.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.status(400).send({ message: 'Invalid token' });
      }
  
      user.isVerified = true;
      await user.save();
  
      res.status(200).send({ message: 'Email verified successfully' });
    } catch (err) {
      console.error(err);
      res.status(400).send({ message: 'Invalid token' });
    }
  });

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
