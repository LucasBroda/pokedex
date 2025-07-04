import styles from "./accueil.module.css";

function Accueil() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Bienvenue sur le Pokedex</h1>
        <p>Explorez, découvrez et gérez vos Pokémon préférés.</p>
      </header>
      <section className={styles.hero}>
        <h2>Votre compagnon ultime pour les Pokémon</h2>
        <p>Découvrez les statistiques, les évolutions, et bien plus encore !</p>
        <button className={styles.ctaButton}>Commencer</button>
      </section>
      <section className={styles.features}>
        <h2>Fonctionnalités</h2>
        <ul>
          <li>Recherchez des Pokémon par nom ou type</li>
          <li>Consultez les statistiques détaillées</li>
          <li>Découvrez les évolutions et les capacités</li>
          <li>Gérez votre propre collection de Pokémon</li>
          <li>Authentifiez-vous pour accéder aux fonctionnalités avancées tels que l'ajout, la modification et la suppression de Pokémon !</li>
        </ul>
      </section>
      <section className={styles.team}>
        <h2>Notre équipe</h2>
        <div className={styles.member}>
          <h3>Lucas Broda</h3>
          <p>Etudiant en AP3</p>
        </div>
        <div className={styles.member}>
          <h3>Axel Fournier</h3>
          <p>Etudiant en AP3</p>
        </div>
        <div className={styles.member}>
          <h3>Lucas Manche</h3>
          <p>Etudiant en AP3</p>
        </div>
      </section>
    </div>
  );
}

export default Accueil;