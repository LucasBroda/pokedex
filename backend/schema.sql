SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS pokemon_type;
DROP TABLE IF EXISTS type;
DROP TABLE IF EXISTS pokemon_egg_group;
DROP TABLE IF EXISTS egg_group;
DROP TABLE IF EXISTS pokemon_ability;
DROP TABLE IF EXISTS ability;
DROP TABLE IF EXISTS evolution;
DROP TABLE IF EXISTS pokemon;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE pokemon (
  id INT PRIMARY KEY,
  name_english VARCHAR(255),
  name_japanese VARCHAR(255),
  name_chinese VARCHAR(255),
  name_french VARCHAR(255),
  hp INT,
  attack INT,
  defense INT,
  sp_attack INT,
  sp_defense INT,
  speed INT,
  species VARCHAR(255),
  description TEXT,
  height VARCHAR(50),
  weight VARCHAR(50),
  gender VARCHAR(50),
  sprite VARCHAR(255),
  thumbnail VARCHAR(255),
  hires VARCHAR(255)
);

CREATE TABLE type (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE
);

CREATE TABLE pokemon_type (
  pokemon_id INT,
  type_id INT,
  PRIMARY KEY (pokemon_id, type_id),
  FOREIGN KEY (pokemon_id) REFERENCES pokemon(id),
  FOREIGN KEY (type_id) REFERENCES type(id)
);

CREATE TABLE egg_group (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE
);

CREATE TABLE pokemon_egg_group (
  pokemon_id INT,
  egg_group_id INT,
  PRIMARY KEY (pokemon_id, egg_group_id),
  FOREIGN KEY (pokemon_id) REFERENCES pokemon(id),
  FOREIGN KEY (egg_group_id) REFERENCES egg_group(id)
);

CREATE TABLE ability (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE
);

CREATE TABLE pokemon_ability (
  pokemon_id INT,
  ability_id INT,
  is_hidden BOOLEAN,
  PRIMARY KEY (pokemon_id, ability_id),
  FOREIGN KEY (pokemon_id) REFERENCES pokemon(id),
  FOREIGN KEY (ability_id) REFERENCES ability(id)
);

CREATE TABLE evolution (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pokemon_id INT,
  next_pokemon_id INT,
  `condition` VARCHAR(255),
  FOREIGN KEY (pokemon_id) REFERENCES pokemon(id),
  FOREIGN KEY (next_pokemon_id) REFERENCES pokemon(id)
);