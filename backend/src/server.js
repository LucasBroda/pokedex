const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pokemonRoutes = require('./routes/pokemonRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/pokemons', pokemonRoutes);
app.use('/api/auth', authRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});