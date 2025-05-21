const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = (db) => {
  const router = express.Router();
  const TOKEN_SECRET = process.env.TOKEN_SECRET;

  // Token generieren (dies ist nur einmal nötig)
  function generateAccessToken(user) {
    return jwt.sign(user, TOKEN_SECRET, { expiresIn: "1800s" });
  }

  // GET /user/login
  router.get("/login", (req, res) => {
    const { username, password } = req.query; // Ändere von req.body zu req.query

    const sql = "SELECT username FROM user WHERE username = ? AND password = ?";
    const values = [username, password];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error("DB-Fehler:", err);
        return res.status(500).json({ status: 500, message: "Datenbankfehler" });
      }

      if (results.length === 0) {
        return res.status(401).json({ status: 401, message: "Benutzername oder Passwort falsch" });
      }

      // Token erzeugen und zurückgeben
      const token = generateAccessToken({ username });
      return res.status(200).json({ status: 200, token, message: "Login erfolgreich" });
    });
  });

  return router;
};