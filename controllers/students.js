const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  //#swagger.tags = ['Students']
  try {
    console.log("Getting all students");
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("students")
      .find();
    const students = await result.toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Failed to fetch students", error: err.message });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags = ['Students']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid student ID format." });
  }
  try {
    const studentId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("students")
      .find({ _id: studentId });
    const students = await result.toArray();
    if (students.length === 0) {
      res.status(404).json({ message: "Student not found" });
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(students[0]);
    }
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).json({ message: "Failed to fetch student", error: err.message });
  }
};

const createStudent = async (req, res) => {
  //#swagger.tags = ['Students']
  try {
    const student = {
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      birthdate: req.body.birthdate,
      address: req.body.address,
      phone_number: req.body.phoneNumber,
      enrollment_year: req.body.enrollmentYear,
      major: req.body.major,
      gpa: req.body.gpa,
    };

    const response = await mongodb
      .getDatabase()
      .db()
      .collection("students")
      .insertOne(student);
    if (response.acknowledged) {
      res.status(201).json({ message: "Student created successfully", id: response.insertedId });
    } else {
      res.status(500).json({ message: "Failed to create student" });
    }
  } catch (err) {
    console.error("Error creating student:", err);
    res.status(500).json({ message: "Failed to create student", error: err.message });
  }
};

const updateStudent = async (req, res) => {
  //#swagger.tags = ['Students']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid student ID format." });
  }

  try {
    const studentId = new ObjectId(req.params.id);
    const student = {
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      birthdate: req.body.birthdate,
      address: req.body.address,
      phone_number: req.body.phoneNumber,
      enrollment_year: req.body.enrollmentYear,
      major: req.body.major,
      gpa: req.body.gpa,
    };

    const response = await mongodb
      .getDatabase()
      .db()
      .collection("students")
      .replaceOne({ _id: studentId }, student);
    if (response.modifiedCount > 0) {
      res.status(200).json({ message: "Student updated successfully" });
    } else {
      res.status(404).json({ message: "Student not found or no changes made" });
    }
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ message: "Failed to update student", error: err.message });
  }
};

const deleteStudent = async (req, res) => {
  //#swagger.tags = ['Students']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid student ID format." });
  }

  try {
    const studentId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("students")
      .deleteOne({ _id: studentId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: "Student deleted successfully" });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ message: "Failed to delete student", error: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createStudent,
  updateStudent,
  deleteStudent,
};
