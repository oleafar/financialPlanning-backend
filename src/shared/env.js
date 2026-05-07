import dotenv from "dotenv";

dotenv.config();

process.env.NODE_ENV ??= "development";
process.env.PORT ??= "3000";
process.env.JWT_SECRET ??= "change-me-in-production";
process.env.DATABASE_URL ??= "file:./dev.db";

export const env = {
  nodeEnv: process.env.NODE_ENV,
  port: Number(process.env.PORT),
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
};
