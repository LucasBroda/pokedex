DROP TABLE IF EXISTS pokemon_type;
DROP TABLE IF EXISTS type;
DROP TABLE IF EXISTS pokemon;

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
  speed INT
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