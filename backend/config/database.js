const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  user: 'postgres',          
  host: 'localhost',         
  database: 'model_monitor', 
  password: 'Bollen123', 
  port: 5432,               
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('error:', err);
});

module.exports = pool;

//env fil