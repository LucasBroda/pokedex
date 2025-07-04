const connection = require('../bd/connexion');

const getPokemons = async (req, res) => {
  const { page = 1, limit = 809, name, type } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM pokemon WHERE 1=1';
  const params = [];

  if (name) {
    query += ' AND name_french LIKE ?';
    params.push(`%${name}%`);
  }

  if (type) {
    query += ' AND FIND_IN_SET(?, types)';
    params.push(type);
  }

  query += ' LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));

  const [rows] = await connection.query(query, params);
  res.json(rows);
};

const getPokemonById = async (req, res) => {
  const { id } = req.params;
  const [rows] = await connection.query('SELECT * FROM pokemon WHERE id = ?', [id]);
  if (rows.length === 0) {
    return res.status(404).json({ message: 'Pokémon introuvable' });
  }
  res.json(rows[0]);
};

const addPokemon = async (req, res) => {
  const {
    id,
    name_french,
    types,
    abilities,
    hp,
    attack,
    defense,
    sp_attack,
    sp_defense,
    speed,
    description,
    height,
    weight,
    hires,
  } = req.body;

  await connection.query(
    `INSERT INTO pokemon (id, name_french, types, abilities, hp, attack, defense, sp_attack, sp_defense, speed, description, height, weight, hires)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,)`,
    [
      id,
      name_french,
      types,
      abilities,
      hp,
      attack,
      defense,
      sp_attack,
      sp_defense,
      speed,
      description,
      height,
      weight,
      hires,
    ]
  );

  res.status(201).json({ message: 'Pokémon bien ajouté' });
};

const updatePokemon = async (req, res) => {
  const { id } = req.params;
  const {
    name_french,
    types,
    abilities,
    hp,
    attack,
    defense,
    sp_attack,
    sp_defense,
    speed,
    description,
    height,
    weight,
    hires,
  } = req.body;

  await connection.query(
    `UPDATE pokemon SET name_french = ?, types = ?, abilities = ?, hp = ?, attack = ?, defense = ?, sp_attack = ?, sp_defense = ?, speed = ?, description = ?, height = ?, weight = ?, hires = ?
    WHERE id = ?`,
    [
      name_french,
      types,
      abilities,
      hp,
      attack,
      defense,
      sp_attack,
      sp_defense,
      speed,
      description,
      height,
      weight,
      hires,
      id,
    ]
  );

  res.json({ message: 'Pokémon mis à jour avec succès' });
};

const deletePokemon = async (req, res) => {
  const { id } = req.params;
  await connection.query('DELETE FROM pokemon WHERE id = ?', [id]);
  res.json({ message: 'Pokémon supprimé avec succès' });
};

module.exports = { getPokemons, getPokemonById, addPokemon, updatePokemon, deletePokemon };