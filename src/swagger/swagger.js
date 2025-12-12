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
    // Server URL is configurable so the OpenAPI spec works both locally
    // and in production (Render). If `SWAGGER_BASE_URL` is not provided,
    // use a relative root (`/`) so Swagger UI calls the same origin that
    // serves the docs instead of trying to reach `localhost:3000` from
    // the user's browser.
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
      {
        url: "https://p3-32168986.onrender.com",
        description: "API server",
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
          example: {
            username: "CoppyCat",
            password: "123456",
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            username: { type: "string" },
            email: { type: "string", format: "email" },
            rol: { type: "string" },
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
        OrderItem: {
          type: "object",
          properties: {
            id: { type: "integer" },
            orderId: { type: "integer" },
            product: { $ref: "#/components/schemas/Product" },
            productId: { type: "integer" },
            quantity: { type: "integer" },
            unitPrice: { type: "integer" },
          },
        },
        OrderCreateRequest: {
          type: "object",
          required: ["products"],
          properties: {
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  productId: { type: "integer" },
                  quantity: { type: "integer" },
                },
              },
            },
            paymentMethod: { type: "string" },
            paymentData: { type: "object" },
          },
          example: {
            products: [{ productId: 1, quantity: 2 }],
            paymentMethod: "credit_card",
            paymentData: {
              "card-number": "4111111111111111",
              cvv: 123,
              "expiration-month": "01",
              "expiration-year": "2024",
              "full-name": "APPROVED",
              currency: "USD",
              description: "cool stuff",
              reference: "si",
            },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "integer" },
            state: { type: "string" },
            totalAmount: { type: "integer" },
            orderItems: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
          },
        },
        OrderList: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/Order" },
            },
            meta: {
              type: "object",
              properties: {
                total: { type: "integer" },
                limit: { type: "integer" },
                page: { type: "integer" },
                pages: { type: "integer" },
              },
            },
          },
        },
        JSendOrderList: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            data: { $ref: "#/components/schemas/OrderList" },
          },
        },
        JSendOrder: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            data: { $ref: "#/components/schemas/Order" },
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
    security: [{ bearerAuth: [] }],
  },
  apis: [`${process.cwd()}/src/routes/*.js`],
};

const specs = swaggerJsdoc(options);
export default specs;
