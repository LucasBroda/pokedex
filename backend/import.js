// import.js
const fs = require('fs');
const { Pool } = require('pg');
const pokemons = require('./pokedex.json');

console.log('🚀 Lancement de l\'import...');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pokedex',
  password: 'root',
  port: 5432,
});

pool.on('error', (err) => {
  console.error('❌ Erreur au niveau de la connexion PostgreSQL :', err);
});

async function importData() {
  try {
    // Vérifie la connexion
    await pool.query('SELECT 1');
    console.log('✅ Connexion à PostgreSQL OK');

    for (const p of pokemons) {
      if (!p.base) {
        console.warn(`⚠️ Pokémon sans base stats ignoré : ID ${p.id}`);
        continue;
      }

      const name = p.name;

      await pool.query(
        `INSERT INTO pokemon (
          id, name_english, name_japanese, name_chinese, name_french,
          hp, attack, defense, sp_attack, sp_defense, speed
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        ON CONFLICT (id) DO NOTHING`,
        [
          p.id,
          name.english,
          name.japanese,
          name.chinese,
          name.french,
          p.base.HP,
          p.base.Attack,
          p.base.Defense,
          p.base['Sp. Attack'],
          p.base['Sp. Defense'],
          p.base.Speed,
        ]
      );

      for (const typeName of p.type) {
        const typeRes = await pool.query(
          `INSERT INTO type (name)
           VALUES ($1)
           ON CONFLICT (name) DO NOTHING
           RETURNING id`,
          [typeName]
        );

        const typeId =
          typeRes.rows[0]?.id ||
          (await pool.query(`SELECT id FROM type WHERE name = $1`, [typeName])).rows[0].id;

        await pool.query(
          `INSERT INTO pokemon_type (pokemon_id, type_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [p.id, typeId]
        );
      }
    }

    console.log('✅ Import terminé');
  } catch (err) {
    console.error('❌ Erreur import :', err);
  } finally {
    await pool.end();
  }
}

importData();
