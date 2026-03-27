import 'dotenv/config';
import path from 'path';
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import operadorRoutes from "./routes/operador";
import clienteRoutes from "./routes/cliente";
import paymentRoutes from "./routes/payment";

const envPath = path.resolve(__dirname, '../.env');

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("❌ Erro ao carregar .env:", result.error);
} else {
  console.log("✅ .env carregado com sucesso!");
  // Teste rápido pra ver se leu a chave (mostra só o começo)
  console.log("Chave lida:", process.env.ASAAS_API_KEY?.substring(0, 10));
}

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/operador", operadorRoutes);
app.use("/api/cliente", clienteRoutes);
app.use("/api/payment", paymentRoutes);

// Rota principal
app.get("/", (req, res) => {
  res.send("API Navega Afua - Backend");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));