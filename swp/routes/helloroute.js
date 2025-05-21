const express = require("express");
const fs = require("fs");
const path = require("path");
const validateSchema = require("../middleware/validation");

module.exports = (db) => {
  const router = express.Router();

  // Schema
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
        if (err) return res.status(400).send({message: "Fehler beim Einfügen in die DB"});
        res.send({ message: "Name gespeichert", name });
      }
    );
  });

  // GET /hello?name=--- Query
  router.get("/", (req, res) => {
    const name = req.query.name;
    if (!name) {
      return res.status(400).json({ error: "Name fehlt in der Query (z.B. ?name=Peter)" });
    }

    res.json({ message: `Hallo, mein Name ist ${name}` });
  });

  // GET /hello/:name Parameter
  router.get("/:name", (req, res) => {
    const name = req.params.name;
    res.json({ message: `Hallo, mein Name ist auch ${name}` });
  });

  return router;
};