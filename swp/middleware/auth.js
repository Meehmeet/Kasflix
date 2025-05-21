const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Kein Token gefunden", status: 401 });

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Falscher Token", status: 403 });
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;