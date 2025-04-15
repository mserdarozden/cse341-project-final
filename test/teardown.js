// test/teardown.js
module.exports = async function() {
    if (global.__MONGOD__) { // Cerrar solo si @shelf/jest-mongodb lo definió
      await global.__MONGOD__.stop();
    }
  };
  