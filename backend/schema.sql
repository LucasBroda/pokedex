DROP TABLE IF EXISTS pokemon_type;
DROP TABLE IF EXISTS type;
DROP TABLE IF EXISTS pokemon;

CREATE TABLE pokemon (
  id INTEGER PRIMARY KEY,
  name_english TEXT,
  name_japanese TEXT,
  name_chinese TEXT,
  name_french TEXT,
  hp INTEGER,
  attack INTEGER,
  defense INTEGER,
  sp_attack INTEGER,
  sp_defense INTEGER,
  speed INTEGER
);

CREATE TABLE type (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE
);

CREATE TABLE pokemon_type (
  pokemon_id INTEGER REFERENCES pokemon(id),
  type_id INTEGER REFERENCES type(id),
  PRIMARY KEY (pokemon_id, type_id)
);