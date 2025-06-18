import React from 'react';

export default function Accueil() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-8">
      <section className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
            Pokedex - L’encyclopédie Pokémon
          </h1>
          <p className="text-lg max-w-xl mx-auto">
            Retrouvez tous vos Pokémon favoris, explorez leurs caractéristiques, gérez vos favoris et profitez d’un espace personnel sécurisé !
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 border-b border-white/40 pb-2">Fonctionnalités principales</h2>
          <ul className="list-disc list-inside space-y-2 text-lg max-w-3xl mx-auto">
            <li>Consultation complète des Pokémon : nom, type, image, ID</li>
            <li>Pagination et choix du nombre de Pokémon affichés</li>
            <li>Filtres par nom et type pour trouver facilement votre Pokémon préféré</li>
            <li>Gestion des favoris accessible après authentification</li>
            <li>Ajout, édition et suppression de Pokémon pour les utilisateurs connectés</li>
            <li>Page de détail riche avec toutes les informations clés</li>
            <li>Authentification sécurisée via email et mot de passe</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-6 border-b border-white/40 pb-2">Notre équipe</h2>
          <div className="flex justify-center gap-12 text-center">
            {[
              { name: 'Lucas Broda', role: 'Développeur Frontend' },
              { name: 'Axel Fournier', role: 'Développeur Backend' },
              { name: 'Lucas Manche', role: 'Chef de projet' },
            ].map(({ name, role }) => (
              <div key={name} className="bg-white/10 rounded-lg p-6 w-48 shadow-lg hover:bg-white/20 transition-colors duration-300">
                <div className="mb-3 text-xl font-bold">{name}</div>
                <div className="text-sm text-gray-200">{role}</div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
