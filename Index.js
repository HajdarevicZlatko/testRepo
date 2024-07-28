require('dotenv').config();
const express = require('express');

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
app.get('/ServisDva', async (req, res) => {
    try {
      res.status(200).send({ message: 'servisDva radi' });
    } catch (err) {
      console.error(err);
      res.status(400).send({ message: 'Invalid token' });
    }
  });

// Ruta za izlistavanje svih korisnika
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password -__v');
    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Internal server error.' });
  }
});


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
