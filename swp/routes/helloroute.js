const express = require("express");
const fs = require("fs");
const path = require("path");
const validateSchema = require("../middleware/validation");

module.exports = (db) => {
  const router = express.Router();

  // Schema der hello.json-Datei
  const helloSchema = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../schema/hello.json"), "utf8")
  );

  // POST /hello
  router.post("/", validateSchema(helloSchema), (req, res) => {
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

  // GET /hello
  router.get("/", (req, res) => {
    const name = req.query.name;
    if (!name) return res.status(400).send("Name fehlt");

    db.query(
      "INSERT INTO greetings (name, source) VALUES (?, ?)",
      [name, "query"],
      (err) => {
        if (err) return res.status(500).send("Fehler beim Einfügen in die DB");
        res.send("Hallo, mein Name ist " + name);
      }
    );
  });

  // GET /hello/:name
  router.get("/:name", (req, res) => {
    const name = req.params.name;

    db.query(
      "INSERT INTO greetings (name, source) VALUES (?, ?)",
      [name, "param"],
      (err) => {
        if (err) return res.status(500).send("Fehler beim Einfügen in die DB");
        res.send("Hallo, mein Name ist auch " + name);
      }
    );
  });

  return router;
};