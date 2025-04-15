const request = require("supertest");
const { app, startServer, stopServer } = require("../server");
const { getDatabase, closeDb } = require("../data/database");
const { ObjectId } = require("mongodb");

describe("/members", () => {
  let testServer;

  beforeAll(async () => {
    testServer = await startServer();
  });

  beforeEach(async () => {
    const db = getDatabase().db();
    await db.collection("members").deleteMany({});
    await db.collection("members").insertMany([
      {
        name: "John Doe",
        email: "john@example.com",
        phoneNumber: "555222222",
        address: "123 Main St",
        membershipDate: "2022-02-18",
        membershipType: "Student",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        phoneNumber: "555333333",
        address: "456 Elm St",
        membershipDate: "2021-05-10",
        membershipType: "Regular",
      },
    ]);
  });

  afterEach(async () => {
    const db = getDatabase().db();
    await db.collection("members").deleteMany({});
  });

  afterAll(async () => {
    await stopServer();
    await closeDb();
  });

  describe("GET /members", () => {
    it("should get all members and return a 200 status code", async () => {
      const res = await request(testServer).get("/members");
      expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([
        {
          _id: expect.any(String),
          name: "John Doe",
          email: "john@example.com",
          phoneNumber: "555222222",
          address: "123 Main St",
          membershipDate: "2022-02-18",
          membershipType: "Student",
        },
        {
          _id: expect.any(String),
          name: "Jane Smith",
          email: "jane@example.com",
          phoneNumber: "555333333",
          address: "456 Elm St",
          membershipDate: "2021-05-10",
          membershipType: "Regular",
        },
      ]);
    });
  });

  describe("GET /members/:id", () => {
    it("should get a single event and return a 200 status code", async () => {
      const resAll = await request(testServer).get("/members");
      const firstMemberId = resAll.body[0]._id;

      const res = await request(testServer).get(`/members/${firstMemberId}`);
      expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        _id: firstMemberId,
        name: "John Doe",
        email: "john@example.com",
        phoneNumber: "555222222",
        address: "123 Main St",
        membershipDate:"2022-02-18",
        membershipType:"Student",
      });
    });

    it("should return a 400 status code for an invalid ID", async () => {
      const res = await request(testServer).get("/members/invalid-id");
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: "Invalid member ID format." });
    });

    it("should return a 404 status code if the member is not found", async () => {
      const nonExistentId = new ObjectId().toHexString();
      const res = await request(testServer).get(`/members/${nonExistentId}`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "Member not found" });
    });
  });
});