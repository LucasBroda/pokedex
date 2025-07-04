import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ajout.module.css";

function Ajout() {
  const [formData, setFormData] = useState({
    id: "",
    name_french: "",
    types: "",
    abilities: "",
    hp: "",
    attack: "",
    defense: "",
    sp_attack: "",
    sp_defense: "",
    speed: "",
    description: "",
    height: "",
    weight: "",
    hires: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des champs numériques
    const numericFields = ["hp", "attack", "defense", "sp_attack", "sp_defense", "speed"];
    for (const field of numericFields) {
      if (isNaN(Number(formData[field]))) {
        alert(`Le champ ${field} doit contenir un nombre valide.`);
        return;
      }
    }

    try {
      // Récupérer le dernier ID de la base de données
      const lastIdResponse = await fetch("http://localhost:3001/api/pokemons/last-id");
      if (lastIdResponse.ok) {
        const { lastId } = await lastIdResponse.json();
        formData.id = (lastId + 1).toString(); // Incrémenter l'ID
      } else {
        alert("Erreur lors de la récupération du dernier ID.");
        return;
      }

      // Ajout du Pokémon
      const response = await fetch("http://localhost:3001/api/pokemons/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Pokémon ajouté avec succès !");
        setFormData({
          id: "",
          name_french: "",
          types: "",
          abilities: "",
          hp: "",
          attack: "",
          defense: "",
          sp_attack: "",
          sp_defense: "",
          speed: "",
          description: "",
          height: "",
          weight: "",
          hires: "",
        });
        navigate("/"); // Rediriger vers la page d'accueil
      } else {
        alert("Erreur lors de l'ajout du Pokémon.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Ajouter un Pokémon</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="name_french"
          placeholder="Nom (Français)"
          value={formData.name_french}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="types"
          placeholder="Type(s)"
          value={formData.types}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="abilities"
          placeholder="Capacités (séparées par des virgules)"
          value={formData.abilities}
          onChange={handleChange}
        />
        <input
          type="text"
          name="hp"
          placeholder="HP"
          value={formData.hp}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="attack"
          placeholder="Attaque"
          value={formData.attack}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="defense"
          placeholder="Défense"
          value={formData.defense}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="sp_attack"
          placeholder="Attaque Spéciale"
          value={formData.sp_attack}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="sp_defense"
          placeholder="Défense Spéciale"
          value={formData.sp_defense}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="speed"
          placeholder="Vitesse"
          value={formData.speed}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="text"
          name="height"
          placeholder="Taille"
          value={formData.height}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="weight"
          placeholder="Poids"
          value={formData.weight}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="hires"
          placeholder="Sprite URL"
          value={formData.hires}
          onChange={handleChange}
        />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}

export default Ajout;