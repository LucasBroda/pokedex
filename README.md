Création de la base de donnée :
psql -U postgres -d pokedex -f schema.sql

Import des pokémons dans la base PostgreSQL :
node import.js
