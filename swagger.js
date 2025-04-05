const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Library Management API',
    description: 'Library Management API'
  },
  host: 'localhost:3000',
  schemes: ['https', 'http']
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);