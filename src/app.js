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

// Morgan es un logger HTTP; ayuda a ver en consola las peticiones entrantes
// (método, ruta, tiempo, código de respuesta, etc.).
import logger from "morgan";

// Importa los routers definidos en la carpeta `routes` para organizar
// los endpoints de la aplicación (modularización de rutas).
import indexRouter from "./routes/index.js";

// Obtener __filename y __dirname en entorno ESM:
// import.meta.url contiene la URL del módulo actual; la convertimos a
// ruta de archivo y luego extraemos el directorio.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Puerto por defecto (no usado en este archivo directamente, pero útil
// para referencia o al arrancar el servidor desde otro módulo).
const PORT = 3000;

// Crea la instancia de la aplicación Express.
var app = express();
app.disable("x-powered-by");

// Logger: registra peticiones HTTP en la consola en formato 'dev'.
app.use(logger("dev"));

// Middleware que parsea JSON en el body de las peticiones y pone el
// resultado en `req.body` (para Content-Type: application/json).
app.use(json());

// Middleware que parsea bodies en formato URL-encoded (formularios HTML).
// `extended: false` usa el parser querystring nativo.
app.use(urlencoded({ extended: false }));

// Middleware para parsear cookies y añadir `req.cookies`.
app.use(cookieParser());

// Middleware para servir archivos estáticos desde la carpeta `public`.
// Ejemplo: /stylesheets/style.css -> ${__dirname}/public/stylesheets/style.css
// NOTA: Se desactiva el envío automático de `index.html` en la raíz.
// Así, la respuesta a `/` la maneja el router (indexRouter) y no el archivo estático.
app.use(express.static(join(__dirname, "../public")));

// Monta los routers importados.
// La ruta `/` ahora es manejada por indexRouter (ver routes/index.js).
app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`server listening on port: http://localhost:${PORT}`);
});
