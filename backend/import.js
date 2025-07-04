const mysql = require('mysql2/promise');
const fs = require('fs');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'pokedex_user',
  password: 'password123',
  database: 'pokedex',
});

async function importData() {
  const data = JSON.parse(fs.readFileSync('./pokemon-data.json', 'utf8'));

  for (const pokemon of data) {
    const { id, name, hp, attack, defense, sp_attack, sp_defense, speed, type } = pokemon;

    // Insérer le Pokémon
    await connection.query(
      'INSERT INTO pokemon (id, name_french, hp, attack, defense, sp_attack, sp_defense, speed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name.french, hp, attack, defense, sp_attack, sp_defense, speed]
    );

    // Insérer les types
    for (const t of type) {
      await connection.query(
        'INSERT IGNORE INTO type (name) VALUES (?)',
        [t]
      );

      const [rows] = await connection.query('SELECT id FROM type WHERE name = ?', [t]);
      const typeId = rows[0].id;

      await connection.query(
        'INSERT INTO pokemon_type (pokemon_id, type_id) VALUES (?, ?)',
        [id, typeId]
      );
    }
  }

  console.log('Importation terminée.');
}

importData().catch((err) => console.error(err));