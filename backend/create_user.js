const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Configuration de la base de données
const connection = mysql.createPool({
  host: 'localhost',
  user: 'pokedex_user',
  password: 'password123',
  database: 'pokedex',
});

async function createAdminUser(email, password) {
  try {
    
    const hashedPassword = await bcrypt.hash(password, 10);

    // Vérifier si l'utilisateur existe déjà
    const [existingUser] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      console.log(`Un utilisateur avec l'email "${email}" existe déjà.`);
      return;
    }

    // Insérer l'utilisateur avec le rôle d'administrateur
    await connection.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'admin']
    );

    console.log(`Utilisateur admin créé avec succès : ${email}`);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur admin :', error);
  } finally {
    connection.end();
  }
}

// Logins de base pour l'utilisateur admin
const email = 'admin@example.com';
const password = 'admin123';
createAdminUser(email, password);