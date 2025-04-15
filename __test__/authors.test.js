const request = require("supertest");
const { app, startServer, stopServer } = require("../server");
const { getDatabase, closeDb } = require("../data/database");
const { ObjectId } = require("mongodb");

describe("/authors", () => {
  let testServer;

  beforeAll(async () => {
    testServer = await startServer();
  });

  beforeEach(async () => {
    const db = getDatabase().db();
    await db.collection("authors").deleteMany({});
    await db.collection("authors").insertMany([
      { name: "Author 1", birthdate: "1980-01-01", nationality: "USA", biography: "Bio 1" },
      { name: "Author 2", birthdate: "1990-01-01", nationality: "UK", biography: "Bio 2" },
    ]);
  });

  afterEach(async () => {
    const db = getDatabase().db();
    await db.collection("authors").deleteMany({});
  });

  afterAll(async () => {
    await stopServer();
    await closeDb();
  });

  describe("GET /authors", () => {
    it("should get all authors and return a 200 status code", async () => {
      const res = await request(testServer).get("/authors");
      expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([
        { _id: expect.any(String), name: "Author 1", birthdate: "1980-01-01", nationality: "USA", biography: "Bio 1" },
        { _id: expect.any(String), name: "Author 2", birthdate: "1990-01-01", nationality: "UK", biography: "Bio 2" },
      ]);
    });
  });

  describe("GET /authors/:id", () => {
    it("should get a single author and return a 200 status code", async () => {
      const resAll = await request(testServer).get("/authors");
      const firstAuthorId = resAll.body[0]._id;

      const res = await request(testServer).get(`/authors/${firstAuthorId}`);
      expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        _id: firstAuthorId,
        name: "Author 1",
        birthdate: "1980-01-01",
        nationality: "USA",
        biography: "Bio 1",
      });
    });

    it("should return a 400 status code for an invalid ID", async () => {
      const res = await request(testServer).get("/authors/invalid-id");
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: "Invalid author ID format." });
    });

    it("should return a 404 status code if the author is not found", async () => {
      const nonExistentId = new ObjectId().toHexString();
      const res = await request(testServer).get(`/authors/${nonExistentId}`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "Author not found" });
    });
  });
});