import React, { useState, useEffect } from "react";
import styles from "./liste.module.css";

function Liste() {
  const [pokemons, setPokemons] = useState<Array<{ id: number; name_french: string; hires: string; types: string[] }>>([]);

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/pokemons/list`);
      const data = await response.json();
      setPokemons(data.map((pokemon: any) => ({
        id: pokemon.id,
        name_french: pokemon.name_french,
        hires: pokemon.hires,
        types: pokemon.types.split(",").map((type: string) => type.trim()),
      })));
    } catch (error) {
      console.error("Erreur lors de la récupération des Pokémon :", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Pokedex</h1>
      <div className={styles.cards}>
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} className={styles.card}>
            <img src={pokemon.hires} alt={pokemon.name_french} />
            <h2>{pokemon.name_french}</h2>
            <p>Type(s) : {pokemon.types.join(", ")}</p>
            <p>ID : {pokemon.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Liste;