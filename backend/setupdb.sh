psql -U postgres -c "CREATE DATABASE pokedex;"
psql -U postgres -d pokedex -f schema.sql