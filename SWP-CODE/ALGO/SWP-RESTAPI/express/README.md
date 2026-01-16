# Auto REST API

Eine REST API für Auto-Informationen mit Express.js und SQLite.

## Features

- ✅ CRUD-Operationen für Autos
- ✅ SQLite Datenbank
- ✅ Unit Tests mit Jest (TDD - Red-Green-Refactor)
- ✅ Vollständige API-Dokumentation

## Installation

```bash
cd express
npm install
```

## Server starten

```bash
npm start
```

Der Server läuft auf `http://localhost:3000`

## Tests ausführen

```bash
# Tests einmalig ausführen
npm test

# Tests im Watch-Modus
npm run test:watch
```

## API Endpoints

### 1. Alle Autos abrufen
```
GET /api/cars
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "marke": "BMW",
      "modell": "M3",
      "ps": 480,
      "plaetze": 5,
      "baujahr": 2023,
      "farbe": "Blau"
    }
  ]
}
```

### 2. Ein Auto abrufen
```
GET /api/cars/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "marke": "BMW",
    "modell": "M3",
    "ps": 480,
    "plaetze": 5,
    "baujahr": 2023,
    "farbe": "Blau"
  }
}
```

### 3. Neues Auto hinzufügen
```
POST /api/cars
```

**Request Body:**
```json
{
  "marke": "Mercedes",
  "modell": "C-Klasse",
  "ps": 300,
  "plaetze": 5,
  "baujahr": 2023,
  "farbe": "Silber"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Auto erfolgreich hinzugefügt",
  "data": {
    "id": 2,
    "marke": "Mercedes",
    "modell": "C-Klasse",
    "ps": 300,
    "plaetze": 5,
    "baujahr": 2023,
    "farbe": "Silber"
  }
}
```

### 4. Auto aktualisieren
```
PUT /api/cars/:id
```

**Request Body:**
```json
{
  "marke": "BMW",
  "modell": "M3 Competition",
  "ps": 510,
  "plaetze": 5,
  "baujahr": 2024,
  "farbe": "Schwarz"
}
```

### 5. Auto löschen
```
DELETE /api/cars/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Auto erfolgreich gelöscht"
}
```

## Datenbank Schema

**Tabelle: autos**

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| id | INTEGER | Primärschlüssel (Auto-Increment) |
| marke | TEXT | Automarke (z.B. BMW, Mercedes) |
| modell | TEXT | Modellname |
| ps | INTEGER | Pferdestärken |
| plaetze | INTEGER | Anzahl der Sitzplätze |
| baujahr | INTEGER | Baujahr |
| farbe | TEXT | Farbe des Autos |

## Test-Driven Development (TDD)

Die API wurde mit dem Red-Green-Refactor Ansatz entwickelt:

1. **RED**: Test schreiben (Test schlägt fehl)
2. **GREEN**: Code implementieren (Test besteht)
3. **REFACTOR**: Code verbessern

Alle Tests befinden sich in `tests/cars.test.js`

## Beispiel mit curl

```bash
# Auto hinzufügen
curl -X POST http://localhost:3000/api/cars \
  -H "Content-Type: application/json" \
  -d '{"marke":"Audi","modell":"A4","ps":250,"plaetze":5,"baujahr":2023,"farbe":"Grau"}'

# Alle Autos abrufen
curl http://localhost:3000/api/cars

# Ein Auto abrufen
curl http://localhost:3000/api/cars/1

# Auto aktualisieren
curl -X PUT http://localhost:3000/api/cars/1 \
  -H "Content-Type: application/json" \
  -d '{"marke":"Audi","modell":"A4 Quattro","ps":280,"plaetze":5,"baujahr":2023,"farbe":"Grau"}'

# Auto löschen
curl -X DELETE http://localhost:3000/api/cars/1
```

## Projektstruktur

```
express/
├── server.js           # Haupt-Server-Datei
├── database.js         # SQLite-Konfiguration
├── routes/
│   └── cars.js        # Auto-Routen
├── tests/
│   └── cars.test.js   # Unit Tests
├── package.json       # Abhängigkeiten
└── README.md          # Dokumentation
```
