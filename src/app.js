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

import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.disable("x-powered-by");

app.use(cors());
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
  })
);
app.use("/about", indexRouter);
app.use("/ping", pingRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/categories", categoryRouter);
app.use("/tags", tagsRouter);
app.use("/rarity", rarityRouter);
app.use("/products", productRouter);

import errorHandler from "./middleware/errorHandler.js";
app.use(errorHandler);

export default app;
