// db.js
const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "kuro",
  password: "36768171",
  database: "turnos_licencia",
  port: 5432,
});

module.exports = pool;
