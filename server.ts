import express from "express";
import cors from "cors";
import routes from "./src/routes/routes";
import { initDB } from "./src/database/database";

// Make sure the database is initialized
initDB();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", routes);

// Simple route for testing
app.get("/", (req, res) => {
  res.json({ message: "API de Plantas - Servidor funcionando!" });
});

// Start server
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});