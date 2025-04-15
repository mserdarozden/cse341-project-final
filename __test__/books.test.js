// const request = require('supertest');
// const { app, server } = require('../server');
// const { ObjectId } = require('mongodb');

// describe('/books', () => {
//   let testServer; // Variable para almacenar el servidor de prueba

//   beforeAll(async () => {
//     // Iniciar el servidor antes de las pruebas
//     testServer = await new Promise((resolve, reject) => {
//       server.on('listening', () => {
//         resolve(server);
//       });
//       server.on('error', (err) => {
//         reject(err);
//       });
//       // Si el servidor ya está escuchando, resolver inmediatamente
//       if (server.listening) {
//         resolve(server);
//       }
//     });
//   });

//   afterAll((done) => {
//     // Cerrar el servidor después de las pruebas
//     if (testServer) { // Verifica que testServer esté definido
//       testServer.close(done);
//     } else {
//       done(); // Llama a done() si el servidor nunca se inició
//     }
//   });

//   describe('GET /books', () => {
//     it('should get all books and return a 200 status code', async () => {
//       const res = await request(testServer).get('/books'); // Usa testServer
//       expect(res.header['content-type']).toBe('application/json; charset=utf-8');
//       expect(res.statusCode).toBe(200);
//       expect(res.body).toEqual([
//         { _id: expect.any(String), title: 'Test Book 1', author: 'Test Author 1' },
//         { _id: expect.any(String), title: 'Test Book 2', author: 'Test Author 2' },
//       ]);
//     });
//   });

//   describe('GET /books/:id', () => {
//     it('should get a single book and return a 200 status code', async () => {
//       const resAll = await request(testServer).get('/books'); // Usa testServer
//       const firstBookId = resAll.body[0]._id;

//       const res = await request(testServer).get(`/books/${firstBookId}`); // Usa testServer
//       expect(res.header['content-type']).toBe('application/json; charset=utf-8');
//       expect(res.statusCode).toBe(200);
//       expect(res.body).toEqual(
//         { _id: firstBookId, title: 'Test Book 1', author: 'Test Author 1' }
//       );
//     });

//     it('should return a 400 status code for an invalid ID', async () => {
//       const res = await request(testServer).get('/books/invalid-id'); // Usa testServer
//       expect(res.statusCode).toBe(400);
//       expect(res.body).toEqual({ message: 'Invalid ID' });
//     });

//     it('should return a 404 status code if the book is not found', async () => {
//       const nonExistentId = new ObjectId().toHexString();
//       const res = await request(testServer).get(`/books/${nonExistentId}`); // Usa testServer
//       expect(res.statusCode).toBe(404);
//       expect(res.body).toEqual({ message: 'Book not found' });
//     });
//   });
// });
// filepath: c:\Users\cfran\OneDrive\Documentos\cse-341-project-final\cse341-project-final\__test__\books.test.js
const request = require("supertest");
const { app, startServer, stopServer } = require("../server");
const { getDatabase, closeDb } = require("../data/database");
const { ObjectId } = require("mongodb");

describe("/books", () => {
  let testServer;

  beforeAll(async () => {
    // Inicia el servidor antes de las pruebas
    testServer = await startServer();
  });

  beforeEach(async () => {
    // Poblar la base de datos con datos de prueba
    const db = getDatabase().db();
    await db.collection("books").deleteMany({});
    await db.collection("books").insertMany([
      { title: "Test Book 1", author: "Test Author 1" },
      { title: "Test Book 2", author: "Test Author 2" },
    ]);
  });

  afterEach(async () => {
    // Limpia la colección después de cada prueba
    const db = getDatabase().db();
    await db.collection("books").deleteMany({});
  });

  afterAll(async () => {
    // Detén el servidor y cierra la conexión a la base de datos después de las pruebas
    await stopServer();
    await closeDb();
  });

  describe("GET /books", () => {
    it("should get all books and return a 200 status code", async () => {
      const res = await request(testServer).get("/books");
      expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([
        { _id: expect.any(String), title: "Test Book 1", author: "Test Author 1" },
        { _id: expect.any(String), title: "Test Book 2", author: "Test Author 2" },
      ]);
    });
  });

  describe("GET /books/:id", () => {
    it("should get a single book and return a 200 status code", async () => {
      const resAll = await request(testServer).get("/books");
      const firstBookId = resAll.body[0]._id;

      const res = await request(testServer).get(`/books/${firstBookId}`);
      expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        _id: firstBookId,
        title: "Test Book 1",
        author: "Test Author 1",
      });
    });

    it("should return a 400 status code for an invalid ID", async () => {
      const res = await request(testServer).get("/books/invalid-id");
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: "Invalid book ID format." });
    });

    it("should return a 404 status code if the book is not found", async () => {
      const nonExistentId = new ObjectId().toHexString();
      const res = await request(testServer).get(`/books/${nonExistentId}`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "Book not found" });
    });
  });
});