import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const adapter = new PrismaNeon({ connectionString });

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("DB connected via PRISMA");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Database connection error: ${message}`);
    process.exit(1);
  }
};

const disconnectDB = async (): Promise<void> => {
  await prisma.$disconnect();
};

export { prisma, connectDB, disconnectDB };
