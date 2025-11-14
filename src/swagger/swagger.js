import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DinoAPI",
      version: "1.0.0",
      description: "API que hace cosas :D",
      contact: {
        name: "Xavix",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Local server",
        },
      ],
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
          required: ["username", "password"],
          properties: {
            username: { type: "string" },
            password: { type: "string" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            username: { type: "string" },
            email: { type: "string", format: "email" },
            rol: { type: "string" },
            password: { type: "string" },
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
        UserUpdate: {
          type: "object",
          required: ["username", "email", "password", "rol"],
          properties: {
            username: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
            rol: { type: "string" },
          },
        },
      },
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "access_token",
        },
      },
    },
  },
  apis: [`${process.cwd()}/src/routes/*.js`],
};

const specs = swaggerJsdoc(options);
export default specs;
