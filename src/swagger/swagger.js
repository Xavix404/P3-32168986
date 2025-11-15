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
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
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
            // password is write-only and not returned in user objects
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
        JSendFail: {
          type: "object",
          properties: {
            status: { type: "string", example: "fail" },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
        JSendSuccess: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            data: { type: ["object", "array"] },
          },
        },
        Tag: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string" },
          },
        },
        Rarity: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "integer" },
            slug: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            category: { $ref: "#/components/schemas/Category" },
            categoryId: { type: "integer" },
            rarity: { $ref: "#/components/schemas/Rarity" },
            rarityId: { type: "integer" },
            effects: { type: "string" },
            element: { type: "string" },
            price: { type: "integer" },
            disponibility: { type: "integer" },
            productsTag: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  tag: { $ref: "#/components/schemas/Tag" },
                },
              },
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
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "access_token",
        },
      },
    },
    // Default: endpoints are protected unless they explicitly opt-out
    // Use bearerAuth as the default in documentation so Swagger UI's
    // Authorize dialog expects an Authorization: Bearer <token> value.
    security: [{ bearerAuth: [] }],
  },
  apis: [`${process.cwd()}/src/routes/*.js`],
};

const specs = swaggerJsdoc(options);
export default specs;
