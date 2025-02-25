import express from "express";
import cors from "cors";
import route from "./src/routes/route";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api", route);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
