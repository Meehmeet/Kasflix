const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = 3000;

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

// Routen einbinden
app.use("/hello", require("./routes/helloroute")(db));
app.use("/person", require("./routes/userroute")(db));

// Server starten
app.listen(port, () => {
  console.log(`Server läuft unter http://localhost:${port}`);
});