const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'autos.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Fehler beim Öffnen der Datenbank:', err.message);
  } else {
    console.log('Verbunden mit SQLite Datenbank');
    initDatabase();
  }
});

function initDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS autos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      marke TEXT NOT NULL,
      modell TEXT NOT NULL,
      ps INTEGER NOT NULL,
      plaetze INTEGER NOT NULL,
      baujahr INTEGER NOT NULL,
      farbe TEXT NOT NULL
    )
  `;

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Fehler beim Erstellen der Tabelle:', err.message);
    } else {
      console.log('Tabelle "autos" ist bereit');
    }
  });
}

module.exports = db;
