const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

dotenv.config();
const app = express();
const port = 3000;
const ajv = new Ajv();
addFormats(ajv);

// 📌 AJV Middleware
function validateSchema(schema) {
    const validate = ajv.compile(schema);
    return (req, res, next) => {
        const valid = validate(req.body);
        if (!valid) {
            return res.status(400).json({
                error: "Ungültiger JSON-Body",
                details: validate.errors,
            });
        }
        next();
    };
}

// 📌 JSON-Schemas
const helloBodySchema = {
    type: "object",
    properties: {
        name: { type: "string", minLength: 1 },
    },
    required: ["name"],
    additionalProperties: false,
};

const personSchema = {
    type: "object",
    properties: {
        vorname: { type: "string" },
        nachname: { type: "string" },
        plz: { type: "string" },
        strasse: { type: "string" },
        ort: { type: "string" },
        telefonnummer: { type: "string" },
        email: { type: "string", format: "email" },
    },
    required: ["vorname", "nachname", "email"],
    additionalProperties: false,
};

// DB-Verbindung
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("Datenbankverbindung fehlgeschlagen:", err);
        process.exit(1);
    }
    console.log("Mit MySQL verbunden!");
});

app.use(express.json());

// GET /hello mit Query-Param
app.get("/hello", (req, res) => {
    const name = req.query.name;
    if (!name) return res.status(400).send("Name fehlt");

    db.query(
        "INSERT INTO greetings (name, source) VALUES (?, ?)",
        [name, "query"],
        (err) => {
            if (err) return res.status(500).send("Fehler beim Einfügen in die DB");
            res.send("hallo mein query ist: " + name);
        }
    );
});

// GET /hello/:name mit URL-Param
app.get("/hello/:name", (req, res) => {
    const name = req.params.name;

    db.query(
        "INSERT INTO greetings (name, source) VALUES (?, ?)",
        [name, "param"],
        (err) => {
            if (err) return res.status(500).send("Fehler beim Einfügen in die DB");
            res.send("hallo mein Name ist auch " + name);
        }
    );
});

// POST /hello/body mit Schema-Validation
app.post("/hello/body", validateSchema(helloBodySchema), (req, res) => {
    const { name } = req.body;

    db.query(
        "INSERT INTO greetings (name, source) VALUES (?, ?)",
        [name, "body"],
        (err) => {
            if (err) return res.status(500).send("Fehler beim Einfügen in die DB");
            res.send({ message: "Name gespeichert", name });
        }
    );
});

// POST /person mit Schema-Validation
app.post("/person", validateSchema(personSchema), (req, res) => {
    const { vorname, nachname, plz, strasse, ort, telefonnummer, email } = req.body;

    const query = `
        INSERT INTO person (vorname, nachname, plz, strasse, ort, telefonnummer, email)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [vorname, nachname, plz, strasse, ort, telefonnummer, email];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Fehler beim Einfügen der Person:", err);
            return res.status(500).send("Fehler beim Speichern der Person");
        }
        res.status(201).send({ message: "Person hinzugefügt", id: result.insertId });
    });
});

// GET /person – alle Personen abrufen
app.get("/person", (req, res) => {
    db.query("SELECT * FROM person", (err, results) => {
        if (err) return res.status(500).send("Fehler beim Abrufen der Personen");
        res.status(200).json(results);
    });
});

// GET /person/:id – eine Person nach ID abrufen
app.get("/person/:id", (req, res) => {
    const { id } = req.params;

    db.query("SELECT * FROM person WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).send("Fehler beim Abrufen der Person");
        if (result.length === 0)
            return res.status(404).send("Person nicht gefunden");
        res.status(200).json(result[0]);
    });
});

// DELETE /person/:id – Person nach ID löschen
app.delete("/person/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM person WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).send("Fehler beim Löschen der Person");
        if (result.affectedRows === 0)
            return res.status(404).send("Person nicht gefunden");
        res.status(200).send("Person gelöscht");
    });
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});