// Importa la función por defecto `express` y los middleware `json` y `urlencoded`
// desde el paquete express. `express` crea la app y los otros son helpers.
import express, { json, urlencoded } from "express";

// Importa utilidades de path para construir rutas de archivos de forma
// segura (cross-platform), `join` concatena rutas y `dirname` obtiene
// el directorio padre de una ruta.
import { join, dirname } from "path";

// `fileURLToPath` convierte la URL del módulo (ESM) a una ruta de archivo
// usable, necesaria para obtener __filename en entornos ESM.
import { fileURLToPath } from "url";

// Middleware para parsear cookies en las peticiones HTTP.
import cookieParser from "cookie-parser";
import logger from "morgan";
import swaggerUI from "swagger-ui-express";
import specs from "../swagger/swagger.js";

import indexRouter from "./routes/about.js";
import pingRouter from "./routes/ping.js";

import "dotenv/config";

// Obtener __filename y __dirname en entorno ESM:
// import.meta.url contiene la URL del módulo actual; la convertimos a
// ruta de archivo y luego extraemos el directorio.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();
app.disable("x-powered-by");

app.use(logger("dev"));
app.use(json());

// Middleware que parsea bodies en formato URL-encoded (formularios HTML).
// `extended: false` usa el parser querystring nativo.
app.use(urlencoded({ extended: false }));

// Middleware para parsear cookies y añadir `req.cookies`.
app.use(cookieParser());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
// Middleware para servir archivos estáticos desde la carpeta `public`.
// Ejemplo: /stylesheets/style.css -> ${__dirname}/public/stylesheets/style.css
app.use(express.static(join(__dirname, "../public")));

app.use("/about", indexRouter);
app.use("/ping", pingRouter);

export default app;
