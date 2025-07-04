const mysql = require('mysql2/promise');
const fs = require('fs');

// Database connection
const connection = mysql.createPool({
  host: 'localhost',
  user: 'pokedex_user',
  password: 'password123',
  database: 'pokedex',
});

async function insertPokemon(pokemon) {
  const { id, name, base, species, description, profile, image } = pokemon;

  // Check if the Pokémon already exists
  const [existingPokemon] = await connection.query('SELECT id FROM pokemon WHERE id = ?', [id]);

  if (existingPokemon.length > 0) {
    console.log(`Pokémon with id ${id} already exists. Skipping insertion.`);
    return; // Skip insertion if the Pokémon already exists
  }

  // Insert the Pokémon if it doesn't exist
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
      base.HP,
      base.Attack,
      base.Defense,
      base['Sp. Attack'],
      base['Sp. Defense'],
      base.Speed,
      species,
      description,
      profile.height,
      profile.weight,
      profile.gender,
      image.sprite,
      image.thumbnail,
      image.hires,
    ]
  );
}

async function insertTypes(pokemonId, types) {
  for (const t of types) {
    // Check if the type already exists
    const [existingType] = await connection.query('SELECT id FROM type WHERE name = ?', [t]);

    if (existingType.length > 0) {
      console.log(`Type "${t}" already exists. Skipping insertion.`);
    } else {
      await connection.query('INSERT INTO type (name) VALUES (?)', [t]);
    }

    const [rows] = await connection.query('SELECT id FROM type WHERE name = ?', [t]);
    const typeId = rows[0]?.id;

    if (typeId) {
      const [existingPokemonType] = await connection.query(
        'SELECT * FROM pokemon_type WHERE pokemon_id = ? AND type_id = ?',
        [pokemonId, typeId]
      );

      if (existingPokemonType.length > 0) {
        console.log(`Relation between Pokémon ${pokemonId} and type "${t}" already exists. Skipping insertion.`);
      } else {
        await connection.query('INSERT INTO pokemon_type (pokemon_id, type_id) VALUES (?, ?)', [pokemonId, typeId]);
      }
    }
  }
}

async function insertEggGroups(pokemonId, eggGroups) {
  for (const eggType of eggGroups) {
    // Check if the egg group already exists
    const [existingEggGroup] = await connection.query('SELECT id FROM egg_group WHERE name = ?', [eggType]);

    if (existingEggGroup.length > 0) {
      console.log(`Egg group "${eggType}" already exists. Skipping insertion.`);
    } else {
      await connection.query('INSERT INTO egg_group (name) VALUES (?)', [eggType]);
    }

    const [rows] = await connection.query('SELECT id FROM egg_group WHERE name = ?', [eggType]);
    const eggGroupId = rows[0]?.id;

    if (eggGroupId) {
      const [existingPokemonEggGroup] = await connection.query(
        'SELECT * FROM pokemon_egg_group WHERE pokemon_id = ? AND egg_group_id = ?',
        [pokemonId, eggGroupId]
      );

      if (existingPokemonEggGroup.length > 0) {
        console.log(`Relation between Pokémon ${pokemonId} and egg group "${eggType}" already exists. Skipping insertion.`);
      } else {
        await connection.query('INSERT INTO pokemon_egg_group (pokemon_id, egg_group_id) VALUES (?, ?)', [pokemonId, eggGroupId]);
      }
    }
  }
}

async function insertAbilities(pokemonId, abilities) {
  for (const [abilityName, isHidden] of abilities) {
    // Check if the ability already exists
    const [existingAbility] = await connection.query('SELECT id FROM ability WHERE name = ?', [abilityName]);

    if (existingAbility.length > 0) {
      console.log(`Ability "${abilityName}" already exists. Skipping insertion.`);
    } else {
      await connection.query('INSERT INTO ability (name) VALUES (?)', [abilityName]);
    }

    const [rows] = await connection.query('SELECT id FROM ability WHERE name = ?', [abilityName]);
    const abilityId = rows[0]?.id;

    if (abilityId) {
      const [existingPokemonAbility] = await connection.query(
        'SELECT * FROM pokemon_ability WHERE pokemon_id = ? AND ability_id = ?',
        [pokemonId, abilityId]
      );

      if (existingPokemonAbility.length > 0) {
        console.log(`Relation between Pokémon ${pokemonId} and ability "${abilityName}" already exists. Skipping insertion.`);
      } else {
        await connection.query('INSERT INTO pokemon_ability (pokemon_id, ability_id, is_hidden) VALUES (?, ?, ?)', [pokemonId, abilityId, isHidden === 'true']);
      }
    }
  }
}

async function insertEvolutions(pokemonId, evolutions) {
  if (evolutions) {
    for (const [nextId, condition] of evolutions) {
      // Vérifier si le Pokémon référencé dans next_pokemon_id existe
      const [existingNextPokemon] = await connection.query('SELECT id FROM pokemon WHERE id = ?', [nextId]);

      if (existingNextPokemon.length === 0) {
        console.log(`Pokémon with id ${nextId} does not exist. Skipping evolution insertion.`);
        continue; // Passer à l'évolution suivante si le Pokémon n'existe pas
      }

      // Vérifier si l'évolution existe déjà
      const [existingEvolution] = await connection.query(
        'SELECT * FROM evolution WHERE pokemon_id = ? AND next_pokemon_id = ? AND `condition` = ?',
        [pokemonId, nextId, condition]
      );

      if (existingEvolution.length > 0) {
        console.log(`Evolution from Pokémon ${pokemonId} to Pokémon ${nextId} with condition "${condition}" already exists. Skipping insertion.`);
      } else {
        await connection.query('INSERT INTO evolution (pokemon_id, next_pokemon_id, `condition`) VALUES (?, ?, ?)', [pokemonId, nextId, condition]);
      }
    }
  }
}

async function importData() {
  try {
    // Load the JSON file
    const data = JSON.parse(fs.readFileSync('./pokedex.json', 'utf8'));

    for (const pokemon of data) {
      const { id, name, type, base, species, description, profile, image } = pokemon;

      // Insert Pokémon
      await insertPokemon({ id, name, base, species, description, profile, image });

      // Insert Types
      if (type) {
        await insertTypes(id, type);
      }

      // Insert Egg Groups
      if (profile?.egg) {
        await insertEggGroups(id, profile.egg);
      }

      // Insert Abilities
      if (profile?.ability) {
        await insertAbilities(id, profile.ability);
      }

      // Insert Evolutions
      if (pokemon?.evolution?.next) {
        await insertEvolutions(id, pokemon.evolution.next);
      }
    }

    console.log('Data import completed successfully.');
  } catch (err) {
    console.error('Error importing data:', err);
  }
}

// Call the importData function
importData().catch((err) => console.error(err));