const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Students API',
    description: 'Students API'
  },
  host: 'localhost:3000',
  schemes: ['https', 'http']
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);