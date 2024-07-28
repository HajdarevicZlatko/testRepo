require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

app.get('/ServisDva', async (req, res) => {
    try {
      res.status(200).send({ message: 'servisDva radi' });
    } catch (err) {
      console.error(err);
      res.status(400).send({ message: 'servisDva radi ne radi' });
    }
  });



app.listen(80, () => {
  console.log(`Server running on port 80 ServisDva`);
});
