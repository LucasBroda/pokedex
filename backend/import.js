const mysql = require('mysql2/promise');
const fs = require('fs');
const { exec } = require('child_process');

// Connection à la base de données MySQL
const connection = mysql.createPool({
  host: 'localhost',
  user: 'pokedex_user',
  password: 'password123',
  database: 'pokedex',
});

async function insertPokemon(pokemon) {
  const { id, name, type, base, description, profile, image } = pokemon;

  // Check si le Pokémon existe déjà
  const [existingPokemon] = await connection.query('SELECT id FROM pokemon WHERE id = ?', [id]);

  if (existingPokemon.length > 0) {
    console.log(`Le Pokémon avec l'id ${id} existe déjà. Insertion ignorée.`);
    return; // Skip l'insertion si le Pokémon existe déjà
  }

  // Préparer les données pour les colonnes intégrées
  const types = type ? type.join(',') : null; // Convertir les types en chaîne séparée par des virgules
  const abilities = profile?.ability
    ? profile.ability.map(([abilityName, isHidden]) => `${abilityName}${isHidden === 'true' ? '(hidden)' : ''}`).join(',')
    : null; // Convertir les capacités en chaîne séparée par des virgules

  // Insertion du Pokémon dans la table pokemon
  await connection.query(
    `INSERT INTO pokemon (
      id, name_french, types, abilities, hp, attack, defense, sp_attack, sp_defense, speed, description, height, weight, hires
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      name?.french || null,
      types,
      abilities,
      base.HP,
      base.Attack,
      base.Defense,
      base['Sp. Attack'],
      base['Sp. Defense'],
      base.Speed,
      description,
      profile.height,
      profile.weight,
      image.hires,
    ]
  );

  console.log(`Pokémon avec l'id ${id} inséré avec succès.`);
}

async function importData() {
  try {
    // Charger les données depuis le fichier JSON
    const data = JSON.parse(fs.readFileSync('./pokedex.json', 'utf8'));

    for (const pokemon of data) {
      await insertPokemon(pokemon);
    }

    console.log('Importation des données terminée avec succès.');

    // Appel à create_user.js après l'importation
    exec('node create_user.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Erreur lors de l'exécution de create_user.js : ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Erreur : ${stderr}`);
        return;
      }
      console.log(`create_user.js exécuté avec succès : ${stdout}`);
    });
  } catch (err) {
    console.error('Erreur lors de l\'importation des données :', err);
  }
}

// Appel de la fonction d'importation
importData().catch((err) => console.error(err));