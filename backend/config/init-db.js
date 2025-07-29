const pool = require('./database');
const bcrypt = require('bcrypt');

// SQL Create tables
const createTables = async () => {
  try {
    // Create user table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create brands table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS brands (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        prompt TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create responses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS responses (
        id SERIAL PRIMARY KEY,
        brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
        response_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create ratings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        response_id INTEGER REFERENCES responses(id) ON DELETE CASCADE,
        rating BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Tables created successfully!');
    
    // Create test-users
    await createTestUsers();
    
  } catch (err) {
    console.error('Error on creation of tables: ', err);
  }
};

// Create test-users with encrypted password
const createTestUsers = async () => {
  try {
    // Check for existing user
    const existingUsers = await pool.query('SELECT * FROM users');
    
    if (existingUsers.rows.length === 0) {
      // encrypt password
      const password1 = await bcrypt.hash('password123', 10);
      const password2 = await bcrypt.hash('admin123', 10);
      
      // Add user
      await pool.query(`
        INSERT INTO users (email, password) VALUES 
        ('user1@example.com', $1),
        ('admin@example.com', $2)
      `, [password1, password2]);
      
      console.log('Test users created:');
      console.log('- user1@example.com (Password: password123)');
      console.log('- admin@example.com (Password: admin123)');
    } else {
      console.log('User already exists within the database');
    }
  } catch (err) {
    console.error('Error when creating user:', err);
  }
};

// Run method
createTables();