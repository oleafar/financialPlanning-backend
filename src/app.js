import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./presentation/routes/index.js";
import { errorMiddleware } from "./presentation/middlewares/error-middleware.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use("/api", routes);
  app.use(errorMiddleware);

  return app;
}
