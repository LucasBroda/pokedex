import React, { useState, useEffect } from "react";
import styles from "./liste.module.css";

function Liste() {
  const [pokemons, setPokemons] = useState<Array<{ id: number; name_french: string; hires: string; types: string[] }>>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Array<{ id: number; name_french: string; hires: string; types: string[] }>>([]);
  const [limit, setLimit] = useState(10); // Par défaut, afficher 10 Pokémon
  const [filterName, setFilterName] = useState(""); // Filtre par nom
  const [filterType, setFilterType] = useState(""); // Filtre par type

  useEffect(() => {
    fetchPokemons();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [limit, filterName, filterType, pokemons]);

  const fetchPokemons = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/pokemons/list`);
      const data = await response.json();
      setPokemons(data.map((pokemon: any) => ({
        id: pokemon.id,
        name_french: pokemon.name_french,
        hires: pokemon.hires ?? "/lapin.webp", // Utiliser l'image de lapin par défaut si hires est vide
        types: pokemon.types.split(",").map((type: string) => type.trim()),
      })));
    } catch (error) {
      console.error("Erreur lors de la récupération des Pokémon :", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...pokemons];

    // Appliquer la limite avant les filtres
    filtered = filtered.slice(0, limit);

    if (filterName) {
      filtered = filtered.filter((pokemon) =>
        pokemon.name_french.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterType) {
      filtered = filtered.filter((pokemon) =>
        pokemon.types.some((type) => type.toLowerCase() === filterType.toLowerCase())
      );
    }

    setFilteredPokemons(filtered);
  };

  return (
    <div className={styles.container}>
      <h1>Pokedex</h1>
      <div className={styles.controls}>
        <label htmlFor="limit">Nombre de Pokémon à afficher :</label>
        <select
          id="limit"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={809}>Tous</option>
        </select>
        <input
          type="text"
          placeholder="Filtrer par nom"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filtrer par type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        />
      </div>
      <div className={styles.cards}>
        {filteredPokemons.map((pokemon) => (
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