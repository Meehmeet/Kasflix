const express = require('express');
const router = express.Router();
const db = require('../database');

// GET alle Autos
router.get('/', (req, res) => {
  const query = 'SELECT * FROM autos';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      success: true,
      data: rows
    });
  });
});

// GET ein Auto nach ID
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM autos WHERE id = ?';
  
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ 
        success: false, 
        message: 'Auto nicht gefunden' 
      });
    }
    res.json({
      success: true,
      data: row
    });
  });
});

// POST neues Auto erstellen
router.post('/', (req, res) => {
  const { marke, modell, ps, plaetze, baujahr, farbe } = req.body;
  
  // Validierung
  if (!marke || !modell || !ps || !plaetze || !baujahr || !farbe) {
    return res.status(400).json({ 
      success: false,
      message: 'Alle Felder sind erforderlich' 
    });
  }

  const query = `
    INSERT INTO autos (marke, modell, ps, plaetze, baujahr, farbe)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [marke, modell, ps, plaetze, baujahr, farbe], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      success: true,
      message: 'Auto erfolgreich hinzugefügt',
      data: {
        id: this.lastID,
        marke,
        modell,
        ps,
        plaetze,
        baujahr,
        farbe
      }
    });
  });
});

// PUT Auto aktualisieren
router.put('/:id', (req, res) => {
  const { marke, modell, ps, plaetze, baujahr, farbe } = req.body;
  
  if (!marke || !modell || !ps || !plaetze || !baujahr || !farbe) {
    return res.status(400).json({ 
      success: false,
      message: 'Alle Felder sind erforderlich' 
    });
  }

  const query = `
    UPDATE autos 
    SET marke = ?, modell = ?, ps = ?, plaetze = ?, baujahr = ?, farbe = ?
    WHERE id = ?
  `;
  
  db.run(query, [marke, modell, ps, plaetze, baujahr, farbe, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Auto nicht gefunden' 
      });
    }
    res.json({
      success: true,
      message: 'Auto erfolgreich aktualisiert',
      data: {
        id: req.params.id,
        marke,
        modell,
        ps,
        plaetze,
        baujahr,
        farbe
      }
    });
  });
});

// DELETE Auto löschen
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM autos WHERE id = ?';
  
  db.run(query, [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Auto nicht gefunden' 
      });
    }
    res.json({
      success: true,
      message: 'Auto erfolgreich gelöscht'
    });
  });
});

module.exports = router;
