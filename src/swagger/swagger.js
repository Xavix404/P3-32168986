import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "dinoAPI",
      version: "1.0.0",
      description: "API restful :D",
      contact: {
        name: "Xavix",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Local server",
        },
      ],
      components: undefined,
    },
    components: {
      schemas: {
        RegisterDTO: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
        LoginDTO: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            username: { type: "string" },
            email: { type: "string", format: "email" },
          },
        },
        UserCreate: {
          type: "object",
          required: ["username", "email", "password", "rol"],
          properties: {
            username: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
            rol: { type: "string" },
          },
        },
        JSendFail: {
          type: "object",
          properties: {
            status: { type: "string", example: "fail" },
            message: { type: "string" },
          },
        },
        JSendSuccess: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            data: {
              type: ["object", "array"],
              description: "Response payload",
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [`${process.cwd()}/src/routes/*.js`],
};

const specs = swaggerJsdoc(options);
export default specs;
