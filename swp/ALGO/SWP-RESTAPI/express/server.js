const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const carsRouter = require('./routes/cars');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/cars', carsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Willkommen zur Auto REST API',
    endpoints: {
      'GET /api/cars': 'Alle Autos abrufen',
      'GET /api/cars/:id': 'Ein Auto abrufen',
      'POST /api/cars': 'Neues Auto hinzufügen',
      'PUT /api/cars/:id': 'Auto aktualisieren',
      'DELETE /api/cars/:id': 'Auto löschen'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint nicht gefunden'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Interner Server-Fehler'
  });
});

// Server starten
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
  });
}

module.exports = app;
