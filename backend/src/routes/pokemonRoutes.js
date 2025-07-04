const express = require('express');
const { getPokemons, getPokemonById, addPokemon, updatePokemon, deletePokemon } = require('../controllers/pokemonController');
const router = express.Router();

router.get('/', getPokemons); // Liste des Pokémon avec pagination et filtres
router.get('/:id', getPokemonById); // Détails d'un Pokémon
router.post('/', addPokemon); // Ajouter un Pokémon
router.put('/:id', updatePokemon); // Modifier un Pokémon
router.delete('/:id', deletePokemon); // Supprimer un Pokémon
router.get('/last-id', async (req, res) => {
    try {
      const [rows] = await connection.query('SELECT MAX(id) AS lastId FROM pokemon');
      res.json({ lastId: rows[0].lastId || 0 });
    } catch (error) {
      console.error('Erreur lors de la récupération du dernier ID :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

module.exports = router;