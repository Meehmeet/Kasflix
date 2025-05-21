const express = require("express");
const fs = require("fs");
const path = require("path");
const validateSchema = require("../middleware/validation");

module.exports = (db) => {
  const router = express.Router();

  // Schema
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
        if (err) return res.status(400).send({message: "Fehler beim Einfügen in die DB", message_code: 1});
        res.send({ message: "Person gespeichert", message_code: 0, id: results.insertId, vorname, nachname, plz, strasse, ort, telefonnummer, email});
      }
    );
  });

  // GET /person/:id
  router.get("/:id", (req, res) => {
    const id = req.params.id;
    db.query("SELECT * FROM person WHERE id = ?", [id], (err, results) => {
      if (err) return res.status(400).send({message: "Fehler beim Abrufen der Person", message_code: 1, id});
      if (results.length === 0) return res.status(404).send({ message: "Person nicht gefunden", message_code: 1, id});
      res.json(results[0]);
    });
  });

  // PUT /person/:id
  router.put("/:id", validateSchema(personSchema), (req, res) => {
    const id = req.params.id;
    const { vorname, nachname, plz, strasse, ort, telefonnummer, email } = req.body;
    db.query(
      "UPDATE person SET vorname = ?, nachname = ?, plz = ?, strasse = ?, ort = ?, telefonnummer = ?, email = ? WHERE id = ?",
      [vorname, nachname, plz, strasse, ort, telefonnummer, email, id],
      (err, result) => {
        if (err) return res.status(400).send({message: "Fehler beim Aktualisieren der Person", message_code: 1, id});
        if (result.affectedRows === 0) return res.status(404).send({ message: "Person nicht gefunden", message_code: 1, id});
        res.send({ message: "Person aktualisiert", message_code: 0, id, vorname, nachname, plz, strasse, ort, telefonnummer, email});
      }
    );
  });

  // DELETE /person/:id
  router.delete("/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM person WHERE id = ?", [id], (err, result) => {
      if (err) return res.status(400).send({message: "Fehler beim Löschen der Person", message_code: 1, id});
      if (result.affectedRows === 0) return res.status(404).send({ message: "Person nicht gefunden", message_code: 1, id});
      res.send({ message: "Person gelöscht", message_code: 0, id });
    });
  });

  return router;
};