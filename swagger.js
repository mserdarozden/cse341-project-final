const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Library Management API',
    description: 'Library Management API'
  },
  host: 'https://cse341-project-final.onrender.com',
  schemes: ['https']
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);