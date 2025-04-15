// Importamos las dependencias necesarias
const request = require("supertest"); // Para realizar solicitudes HTTP a la aplicación
const { app, startServer, stopServer } = require("../server"); // Servidor y funciones para iniciarlo/detenerlo
const { getDatabase, closeDb } = require("../data/database"); // Funciones para interactuar con la base de datos
const { ObjectId } = require("mongodb"); // Para trabajar con IDs de MongoDB

// Describimos el conjunto de pruebas para la ruta "/events"
describe("/events", () => {
  let testServer; // Variable para almacenar la instancia del servidor

  // Antes de todas las pruebas, iniciamos el servidor
  beforeAll(async () => {
    testServer = await startServer();
  });

  // Antes de cada prueba, limpiamos la colección "events" y la llenamos con datos de prueba
  beforeEach(async () => {
    const db = getDatabase().db();
    await db.collection("events").deleteMany({}); // Eliminamos todos los documentos existentes
    await db.collection("events").insertMany([
      {
        name: "Event 1",
        date: "2025-01-01",
        location: "Location 1",
        description: "Description 1",
        capacity: 100,
        organizer: "Organizer 1",
      },
      {
        name: "Event 2",
        date: "2025-02-01",
        location: "Location 2",
        description: "Description 2",
        capacity: 200,
        organizer: "Organizer 2",
      },
    ]); // Insertamos datos de prueba
  });

  // Después de cada prueba, limpiamos la colección "events"
  afterEach(async () => {
    const db = getDatabase().db();
    await db.collection("events").deleteMany({});
  });

  // Después de todas las pruebas, detenemos el servidor y cerramos la conexión a la base de datos
  afterAll(async () => {
    await stopServer();
    await closeDb();
  });

  // Pruebas para la ruta GET /events
  describe("GET /events", () => {
    it("should get all events and return a 200 status code", async () => {
      // Realizamos una solicitud GET a la ruta "/events"
      const res = await request(testServer).get("/events");

      // Verificamos que el encabezado de la respuesta sea JSON
      expect(res.header["content-type"]).toBe("application/json; charset=utf-8");

      // Verificamos que el código de estado sea 200
      expect(res.statusCode).toBe(200);

      // Verificamos que el cuerpo de la respuesta contenga los datos esperados
      expect(res.body).toEqual([
        {
          _id: expect.any(String), // Verificamos que el ID sea un string
          name: "Event 1",
          date: "2025-01-01",
          location: "Location 1",
          description: "Description 1",
          capacity: 100,
          organizer: "Organizer 1",
        },
        {
          _id: expect.any(String),
          name: "Event 2",
          date: "2025-02-01",
          location: "Location 2",
          description: "Description 2",
          capacity: 200,
          organizer: "Organizer 2",
        },
      ]);
    });
  });

  // Pruebas para la ruta GET /events/:id
  describe("GET /events/:id", () => {
    it("should get a single event and return a 200 status code", async () => {
      // Obtenemos todos los eventos para extraer el ID del primer evento
      const resAll = await request(testServer).get("/events");
      const firstEventId = resAll.body[0]._id;

      // Realizamos una solicitud GET a la ruta "/events/:id" con el ID del primer evento
      const res = await request(testServer).get(`/events/${firstEventId}`);

      // Verificamos que el encabezado de la respuesta sea JSON
      expect(res.header["content-type"]).toBe("application/json; charset=utf-8");

      // Verificamos que el código de estado sea 200
      expect(res.statusCode).toBe(200);

      // Verificamos que el cuerpo de la respuesta contenga los datos del evento esperado
      expect(res.body).toEqual({
        _id: firstEventId,
        name: "Event 1",
        date: "2025-01-01",
        location: "Location 1",
        description: "Description 1",
        capacity: 100,
        organizer: "Organizer 1",
      });
    });

    it("should return a 400 status code for an invalid ID", async () => {
      // Realizamos una solicitud GET a la ruta "/events/:id" con un ID inválido
      const res = await request(testServer).get("/events/invalid-id");

      // Verificamos que el código de estado sea 400
      expect(res.statusCode).toBe(400);

      // Verificamos que el cuerpo de la respuesta contenga el mensaje de error esperado
      expect(res.body).toEqual({ message: "Invalid event ID format." });
    });

    it("should return a 404 status code if the event is not found", async () => {
      // Generamos un ID válido pero inexistente
      const nonExistentId = new ObjectId().toHexString();

      // Realizamos una solicitud GET a la ruta "/events/:id" con el ID inexistente
      const res = await request(testServer).get(`/events/${nonExistentId}`);

      // Verificamos que el código de estado sea 404
      expect(res.statusCode).toBe(404);

      // Verificamos que el cuerpo de la respuesta contenga el mensaje de error esperado
      expect(res.body).toEqual({ message: "Event not found" });
    });
  });
});