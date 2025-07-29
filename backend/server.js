require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const { router: authRoutes } = require('./routes/auth');
const brandRoutes = require('./routes/brands');
const responseRoutes = require('./routes/responses');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Allow us to receive JSON data

// Routes
app.use('/api/auth', authRoutes);   // All auth routes: /api/auth/login, /api/auth/logout
app.use('/api/brands', brandRoutes); // All brand routes: /api/brands, /api/brands/:id
app.use('/api/responses', responseRoutes); // All response routes

// Test route to see that server works
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend works!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test: http://localhost:${PORT}/api/test`);
});