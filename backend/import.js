const mysql = require('mysql2/promise');
const fs = require('fs');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'pokedex_user',
  password: 'password123',
  database: 'pokedex',
});

async function importData() {
  const data = JSON.parse(fs.readFileSync('./pokedex.json', 'utf8'));

  for (const pokemon of data) {
    const {
      id,
      name,
      type = [],
      base = {},
      species = null,
      description = null,
      evolution = {},
      profile = {},
      image = {},
    } = pokemon;

    const {
      HP = 0,
      Attack = 0,
      Defense = 0,
      'Sp. Attack': sp_attack = 0,
      'Sp. Defense': sp_defense = 0,
      Speed = 0,
    } = base;

    const {
      height = null,
      weight = null,
      egg = [],
      ability = [],
      gender = null,
    } = profile;

    const {
      sprite = null,
      thumbnail = null,
      hires = null,
    } = image;

    // Insérer le Pokémon
    await connection.query(
      `INSERT INTO pokemon (
        id, name_english, name_japanese, name_chinese, name_french, hp, attack, defense, sp_attack, sp_defense, speed, species, description, height, weight, gender, sprite, thumbnail, hires
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name?.english || null,
        name?.japanese || null,
        name?.chinese || null,
        name?.french || null,
        HP,
        Attack,
        Defense,
        sp_attack,
        sp_defense,
        Speed,
        species,
        description,
        height,
        weight,
        gender,
        sprite,
        thumbnail,
        hires,
      ]
    );

    // Insérer les types
    for (const t of type) {
      await connection.query(
        'INSERT IGNORE INTO type (name) VALUES (?)',
        [t]
      );

      const [rows] = await connection.query('SELECT id FROM type WHERE name = ?', [t]);
      const typeId = rows[0]?.id;

      if (typeId) {
        await connection.query(
          'INSERT INTO pokemon_type (pokemon_id, type_id) VALUES (?, ?)',
          [id, typeId]
        );
      }
    }

    // Insérer les œufs
    for (const eggType of egg) {
      await connection.query(
        'INSERT IGNORE INTO egg_group (name) VALUES (?)',
        [eggType]
      );

      const [rows] = await connection.query('SELECT id FROM egg_group WHERE name = ?', [eggType]);
      const eggGroupId = rows[0]?.id;

      if (eggGroupId) {
        await connection.query(
          'INSERT INTO pokemon_egg_group (pokemon_id, egg_group_id) VALUES (?, ?)',
          [id, eggGroupId]
        );
      }
    }

    // Insérer les capacités
    for (const [abilityName, isHidden] of ability) {
      await connection.query(
        'INSERT IGNORE INTO ability (name) VALUES (?)',
        [abilityName]
      );

      const [rows] = await connection.query('SELECT id FROM ability WHERE name = ?', [abilityName]);
      const abilityId = rows[0]?.id;

      if (abilityId) {
        await connection.query(
          'INSERT INTO pokemon_ability (pokemon_id, ability_id, is_hidden) VALUES (?, ?, ?)',
          [id, abilityId, isHidden === 'true']
        );
      }
    }

    // Insérer les évolutions
    if (evolution?.next) {
      for (const [nextId, condition] of evolution.next) {
        await connection.query(
          'INSERT INTO evolution (pokemon_id, next_pokemon_id, condition) VALUES (?, ?, ?)',
          [id, nextId, condition]
        );
      }
    }
  }

  console.log('Importation terminée.');
}

importData().catch((err) => console.error(err));