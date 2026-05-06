import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import routes from "./presentation/routes/index.js";
import { openApiSpec } from "./presentation/docs/openapi.js";
import { errorMiddleware } from "./presentation/middlewares/error-middleware.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());
  app.get("/docs.json", (_req, res) => {
    res.status(200).json(openApiSpec);
  });
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
  app.use("/api", routes);
  app.use(errorMiddleware);

  return app;
}
