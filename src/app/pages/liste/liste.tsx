import React, { useState, useEffect } from "react";
import styles from "./liste.module.css";

// Type pour un Pokémon
type Pokemon = {
  id: number;
  name_french: string;
  hires: string;
  types: string[];
};

// Props attendues par la modale
type ModalProps = {
  pokemon: Pokemon | null;
  onClose: () => void;
  onUpdate: (updatedPokemon: Pokemon) => void;
  onAddFavorite: (pokemon: Pokemon) => void;
};

// Composant modale d’un Pokémon
function PokemonModal({ pokemon, onClose, onUpdate, onAddFavorite }: ModalProps) {
  const [editedPokemon, setEditedPokemon] = useState<Pokemon | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Réinitialise la modale à chaque changement de Pokémon
  useEffect(() => {
    setEditedPokemon(pokemon);
    setIsEditing(false);
  }, [pokemon]);

  if (!editedPokemon) return null;

  // Met à jour un champ du Pokémon édité
  const handleChange = (field: keyof Pokemon, value: any) => {
    setEditedPokemon({ ...editedPokemon, [field]: value });
  };

  // Sauvegarde des modifications via API
  const saveChanges = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/pokemons/update/${editedPokemon.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedPokemon),
      });
      if (res.ok) {
        onUpdate(editedPokemon);
        setIsEditing(false);
        alert("Modifications sauvegardées !");
      } else {
        alert("Erreur lors de la sauvegarde.");
      }
    } catch (e) {
      alert("Erreur réseau.");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>

        {/* Affichage en lecture seule ou en édition */}
        {!isEditing ? (
          <>
            <h2>{editedPokemon.name_french}</h2>
            <img src={editedPokemon.hires} alt={editedPokemon.name_french} style={{ width: "100%", borderRadius: "10px" }} />
            <p><strong>Type(s) :</strong> {editedPokemon.types.join(", ")}</p>
            <p><strong>ID :</strong> {editedPokemon.id}</p>

            <button onClick={() => onAddFavorite(editedPokemon)}>Ajouter aux favoris</button>
            <button onClick={() => setIsEditing(true)}>Modifier</button>
          </>
        ) : (
          <>
            <h2>Modifier Pokémon</h2>

            <label>Nom :</label>
            <input
              type="text"
              value={editedPokemon.name_french}
              onChange={(e) => handleChange("name_french", e.target.value)}
            />

            <label>Image URL :</label>
            <input
              type="text"
              value={editedPokemon.hires}
              onChange={(e) => handleChange("hires", e.target.value)}
            />

            <label>Types (séparés par des virgules) :</label>
            <input
              type="text"
              value={editedPokemon.types.join(", ")}
              onChange={(e) =>
                handleChange(
                  "types",
                  e.target.value.split(",").map((type) => type.trim())
                )
              }
            />

            <div style={{ marginTop: "15px" }}>
              <button onClick={() => onAddFavorite(editedPokemon)}>Ajouter aux favoris</button>
              <button onClick={saveChanges} style={{ marginLeft: "10px" }}>Sauvegarder</button>
              <button onClick={() => setIsEditing(false)} style={{ marginLeft: "10px" }}>Annuler</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Composant principal de la liste de Pokémon
function Liste() {
  const [pokemons, setPokemons] = useState<Array<{ id: number; name_french: string; hires: string; types: string[] }>>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Array<{ id: number; name_french: string; hires: string; types: string[] }>>([]);
  const [limit, setLimit] = useState(10); // Par défaut, afficher 10 Pokémon
  const [filterName, setFilterName] = useState(""); // Filtre par nom
  const [filterType, setFilterType] = useState(""); // Filtre par type

  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  // Récupération des favoris depuis localStorage
  const [favorites, setFavorites] = useState<Pokemon[]>(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    fetchPokemons();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [limit, filterName, filterType, pokemons]);

  // Récupère les Pokémon depuis l’API
  const fetchPokemons = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/pokemons/list`);
      const data = await response.json();
      setPokemons(
        data.map((pokemon: any) => ({
          id: pokemon.id,
          name_french: pokemon.name_french,
          hires: pokemon.hires,
          types: pokemon.types.split(",").map((type: string) => type.trim()),
        }))
      );
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
  // Met à jour un Pokémon dans la liste après édition
  const handleUpdate = (updatedPokemon: Pokemon) => {
    setPokemons((prev) =>
      prev.map((p) => (p.id === updatedPokemon.id ? updatedPokemon : p))
    );
  };

  // Ajoute un Pokémon aux favoris (et le stocke dans localStorage)
  const handleAddFavorite = (pokemon: Pokemon) => {
    if (!favorites.find((fav) => fav.id === pokemon.id)) {
      const newFavs = [...favorites, pokemon];
      setFavorites(newFavs);
      localStorage.setItem("favorites", JSON.stringify(newFavs));
      alert(`${pokemon.name_french} ajouté aux favoris !`);
    } else {
      alert(`${pokemon.name_french} est déjà dans les favoris.`);
    }

  };

  return (
    <div className={styles.container}>
      <h1>Pokedex</h1>

      {/* Contrôle pour le nombre de Pokémon à afficher */}
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

      {/* Affichage des cartes Pokémon */}
      <div className={styles.cards}>
        {filteredPokemons.map((pokemon) => (
          <div key={pokemon.id} className={styles.card}>

        {pokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            className={styles.card}
            onClick={() => setSelectedPokemon(pokemon)}
            style={{ cursor: "pointer" }}
          >
            <img src={pokemon.hires} alt={pokemon.name_french} />
            <h2>{pokemon.name_french}</h2>
            <p>Type(s) : {pokemon.types.join(", ")}</p>
            <p>ID : {pokemon.id}</p>
          </div>
        ))}
      </div>

      {/* Modale ouverte au clic sur une carte */}
      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          onUpdate={handleUpdate}
          onAddFavorite={handleAddFavorite}
        />
      )}
    </div>
  );
}

export default Liste;
