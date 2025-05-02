// swagger.js
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Startups24x7 API",
      version: "1.0.0",
      description: "API documentation for Startups24x7 backend",
    },
    servers: [
      {
        url: "http://localhost:5000", // change to your backend URL
      },
    ],
  },
  apis: ["./service/*.js"], // path to your route files
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
