const express = require("express");
const fs = require("fs");
const path = require("path");
const validateSchema = require("../middleware/validation");

module.exports = (db) => {
  const router = express.Router();

  // Lade Schema für Person
  const personSchema = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../schema/person.json"), "utf8")
  );

  // POST /person
  router.post("/", validateSchema(personSchema), (req, res) => {
    const { vorname, nachname, plz, strasse, ort, telefonnummer, email } = req.body;
    db.query(
      "INSERT INTO person (vorname, nachname, plz, strasse, ort, telefonnummer, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [vorname, nachname, plz, strasse, ort, telefonnummer, email],
      (err, results) => {
        if (err) return res.status(500).send("Fehler beim Einfügen in die DB");
        res.send({ message: "Person gespeichert", id: results.insertId, vorname, nachname});
      }
    );
  });

  return router;
};