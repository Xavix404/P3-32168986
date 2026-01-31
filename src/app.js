import express, { json, urlencoded } from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";
import swaggerUI from "swagger-ui-express";
import specs from "./swagger/swagger.js";
import cors from "cors";

import indexRouter from "./routes/about.routes.js";
import pingRouter from "./routes/ping.routes.js";
import userRouter from "./routes/users.routes.js";
import authRouter from "./routes/auth.routes.js";
import categoryRouter from "./routes/categories.routes.js";
import tagsRouter from "./routes/tags.routes.js";
import rarityRouter from "./routes/rarity.routes.js";
import productRouter from "./routes/product.routes.js";
import orderRouter from "./routes/order.routes.js";

import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.disable("x-powered-by");

// Configure CORS dynamically according to environment.
// In development we allow the dev server (origin: true). In production we
// restrict to the CLIENT_ORIGIN env var if provided.
const isProd = process.env.NODE_ENV === "production";
const corsOptions = isProd
  ? {
      origin: process.env.CLIENT_ORIGIN || false,
      credentials: true,
    }
  : { origin: true, credentials: true };

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "../public")));

app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(specs, null, {
    swaggerOptions: { requestCredentials: "include" },
  }),
);
app.use("/api/about", indexRouter);
app.use("/api/ping", pingRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/rarity", rarityRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

import errorHandler from "./middleware/errorHandler.js";
app.use(errorHandler);

// Serve frontend static files in production (Vite default output: /frontend/dist)
import { existsSync } from "fs";
const clientDist = join(__dirname, "../frontend/dist");
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("*", (req, res) => {
    res.sendFile(join(clientDist, "index.html"));
  });
}

export default app;
