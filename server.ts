// Arquivo principal do servidor
import db from './src/database/initDatabase'; // Este import já inicializa o banco de dados
import express from "express";
import cors from "cors";
import router from "./src/routes/route";

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// Rotas
app.use("/api", router);

// Rota simples para teste
app.get("/", (req, res) => {
  res.json({ message: "API de Plantas - Servidor funcionando!" });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});