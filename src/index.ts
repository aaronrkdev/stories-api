import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB, disconnectDB } from "./configs/db";

connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("API des histoires en marche !");
});

const server = app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

//handle unhandled promise Rejection (e.g database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection: ", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

//handle uncaught exception
process.on("uncaughtException", async (err) => {
  console.error("Uncaught exception: ", err);
  await disconnectDB();
  process.exit(1);
});

//Gaceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
