import swaggerJsdoc from "swagger-jsdoc";
import { cwd } from "process";

const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "temp", version: "1.0.0" },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        cookieAuth: { type: "apiKey", in: "cookie", name: "access_token" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [`${cwd()}/src/routes/*.js`],
};

try {
  const specs = swaggerJsdoc(options);
  const out = {};
  for (const [path, methods] of Object.entries(specs.paths || {})) {
    out[path] = {};
    for (const [method, op] of Object.entries(methods)) {
      out[path][method] = { security: op.security ?? null };
    }
  }
  console.log(
    JSON.stringify(
      {
        pathsCount: Object.keys(specs.paths || {}).length,
        paths: out,
        securitySchemes: Object.keys(specs.components?.securitySchemes || {}),
        globalSecurity: specs.security || null,
      },
      null,
      2
    )
  );
} catch (e) {
  console.error("ERROR", e);
  process.exit(1);
}
