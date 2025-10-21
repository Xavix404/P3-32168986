import express, { json, urlencoded } from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";
import swaggerUI from "swagger-ui-express";
import specs from "./swagger/swagger.js";

import indexRouter from "./routes/about.routes.js";
import pingRouter from "./routes/ping.routes.js";
import userRouter from "./routes/users.routes.js";

import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.disable("x-powered-by");

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "../public")));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use("/about", indexRouter);
app.use("/ping", pingRouter);
app.use("/user", userRouter);

import errorHandler from "./middleware/errorHandler.js";
app.use(errorHandler);

export default app;
