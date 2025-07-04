const express = require('express');
const { getPokemons, getPokemonById, addPokemon, updatePokemon, deletePokemon } = require('../controllers/pokemonController');
const router = express.Router();

router.get('/', getPokemons); // Liste des Pokémon avec pagination et filtres
router.get('/:id', getPokemonById); // Détails d'un Pokémon
router.post('/', addPokemon); // Ajouter un Pokémon
router.put('/:id', updatePokemon); // Modifier un Pokémon
router.delete('/:id', deletePokemon); // Supprimer un Pokémon

module.exports = router;