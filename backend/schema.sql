SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS pokemon;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE pokemon (
  id INT AUTO_INCREMENT PRIMARY KEY,
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
  hires VARCHAR(255),
  types VARCHAR(255),
  egg_groups VARCHAR(255),
  abilities VARCHAR(255),
  evolution_next INT,
  evolution_condition VARCHAR(255)
);