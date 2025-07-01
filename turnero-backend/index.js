// index.js
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Endpoint para buscar si el DNI tiene turno.
app.get("/api/turnos/:dni", async (req, res) => {
  const { dni } = req.params;

  try {
    const result = await pool.query("SELECT * FROM usuario WHERE dni = $1", [dni]);

    if (result.rows.length > 0) {
      res.json({ tieneTurno: true, turno: result.rows[0] });
    } else {
      res.json({ tieneTurno: false });
    }
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
