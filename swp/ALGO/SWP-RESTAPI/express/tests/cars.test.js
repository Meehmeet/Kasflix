const request = require('supertest');
const app = require('../server');
const db = require('../database');

// Helper-Funktion zum Löschen aller Testdaten
const clearDatabase = () => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM autos', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// RED-GREEN-REFACTOR: Test Driven Development

describe('Auto REST API Tests', () => {
  
  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll((done) => {
    db.close(done);
  });

  // RED: Test schreiben (sollte fehlschlagen)
  // GREEN: Code implementieren (Test sollte bestehen)
  
  describe('GET /api/cars', () => {
    test('sollte ein leeres Array zurückgeben wenn keine Autos vorhanden sind', async () => {
      const response = await request(app).get('/api/cars');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    test('sollte alle Autos zurückgeben', async () => {
      // Testdaten hinzufügen
      await new Promise((resolve) => {
        db.run(
          'INSERT INTO autos (marke, modell, ps, plaetze, baujahr, farbe) VALUES (?, ?, ?, ?, ?, ?)',
          ['BMW', 'M3', 480, 5, 2023, 'Blau'],
          resolve
        );
      });

      const response = await request(app).get('/api/cars');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].marke).toBe('BMW');
    });
  });

  describe('GET /api/cars/:id', () => {
    test('sollte ein Auto nach ID zurückgeben', async () => {
      // Testdaten hinzufügen
      const id = await new Promise((resolve) => {
        db.run(
          'INSERT INTO autos (marke, modell, ps, plaetze, baujahr, farbe) VALUES (?, ?, ?, ?, ?, ?)',
          ['Audi', 'A4', 250, 5, 2022, 'Schwarz'],
          function() {
            resolve(this.lastID);
          }
        );
      });

      const response = await request(app).get(`/api/cars/${id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.marke).toBe('Audi');
      expect(response.body.data.modell).toBe('A4');
    });

    test('sollte 404 zurückgeben wenn Auto nicht existiert', async () => {
      const response = await request(app).get('/api/cars/999');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/cars', () => {
    test('sollte ein neues Auto erstellen', async () => {
      const neuesAuto = {
        marke: 'Mercedes',
        modell: 'C-Klasse',
        ps: 300,
        plaetze: 5,
        baujahr: 2023,
        farbe: 'Silber'
      };

      const response = await request(app)
        .post('/api/cars')
        .send(neuesAuto);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.marke).toBe('Mercedes');
      expect(response.body.data.id).toBeDefined();
    });

    test('sollte 400 zurückgeben wenn Felder fehlen', async () => {
      const unvollstaendigesAuto = {
        marke: 'VW',
        modell: 'Golf'
        // Fehlende Felder: ps, plaetze, baujahr, farbe
      };

      const response = await request(app)
        .post('/api/cars')
        .send(unvollstaendigesAuto);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/cars/:id', () => {
    test('sollte ein Auto aktualisieren', async () => {
      // Testdaten hinzufügen
      const id = await new Promise((resolve) => {
        db.run(
          'INSERT INTO autos (marke, modell, ps, plaetze, baujahr, farbe) VALUES (?, ?, ?, ?, ?, ?)',
          ['Porsche', '911', 450, 4, 2021, 'Rot'],
          function() {
            resolve(this.lastID);
          }
        );
      });

      const aktualisiertesDaten = {
        marke: 'Porsche',
        modell: '911 Turbo',
        ps: 580,
        plaetze: 4,
        baujahr: 2021,
        farbe: 'Rot'
      };

      const response = await request(app)
        .put(`/api/cars/${id}`)
        .send(aktualisiertesDaten);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.modell).toBe('911 Turbo');
      expect(response.body.data.ps).toBe(580);
    });

    test('sollte 404 zurückgeben wenn Auto nicht existiert', async () => {
      const aktualisiertesDaten = {
        marke: 'Tesla',
        modell: 'Model 3',
        ps: 450,
        plaetze: 5,
        baujahr: 2023,
        farbe: 'Weiß'
      };

      const response = await request(app)
        .put('/api/cars/999')
        .send(aktualisiertesDaten);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/cars/:id', () => {
    test('sollte ein Auto löschen', async () => {
      // Testdaten hinzufügen
      const id = await new Promise((resolve) => {
        db.run(
          'INSERT INTO autos (marke, modell, ps, plaetze, baujahr, farbe) VALUES (?, ?, ?, ?, ?, ?)',
          ['Ford', 'Mustang', 460, 4, 2022, 'Gelb'],
          function() {
            resolve(this.lastID);
          }
        );
      });

      const response = await request(app).delete(`/api/cars/${id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verifizieren dass das Auto gelöscht wurde
      const getResponse = await request(app).get(`/api/cars/${id}`);
      expect(getResponse.status).toBe(404);
    });

    test('sollte 404 zurückgeben wenn Auto nicht existiert', async () => {
      const response = await request(app).delete('/api/cars/999');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  // ABSICHTLICH FEHLSCHLAGENDER TEST - zum Prüfen ob Testsystem funktioniert
  describe('Testsystem Validierung', () => {
    test('DIESER TEST SOLLTE FEHLSCHLAGEN', async () => {
      // Dieser Test ist absichtlich falsch geschrieben
      expect(1 + 1).toBe(3); // Falsch: 1 + 1 ist 2, nicht 3
      expect('test').toBe('TEST'); // Falsch: Groß-/Kleinschreibung stimmt nicht
      expect(true).toBe(false); // Falsch: true ist nicht false
    });
  });
});
