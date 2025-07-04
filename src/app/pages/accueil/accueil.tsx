import styles from "./accueil.module.css";

function Accueil() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Bienvenue sur My Pokedex</h1>
        <p>Explorez, découvrez et gérez vos Pokémon préférés.</p>
      </header>
      <section className={styles.features}>
        <h2>Fonctionnalités</h2>
        <ul>
          <li>Recherchez des Pokémon par nom ou type</li>
          <li>Consultez les statistiques détaillées</li>
          <li>Découvrez les évolutions et les capacités</li>
          <li>Gérez votre propre collection de Pokémon</li>
        </ul>
      </section>
      <section className={styles.team}>
        <h2>Notre équipe</h2>
        <div>
          <h3>Lucas Broda</h3>
          <p>Développeur Backend</p>
        </div>
      </section>
    </div>
  );
}

export default Accueil;