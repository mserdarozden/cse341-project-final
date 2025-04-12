// Controller for the 'members' collection
const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAllMembers = async (req, res) => {
  //#swagger.tags = ['Members']
  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("members")
      .find();
    const members = await result.toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(members);
  } catch (err) {
    console.error("Error fetching members:", err);
    res.status(500).json({ message: "Failed to fetch members", error: err.message });
  }
};

const getSingleMember = async (req, res) => {
  //#swagger.tags = ['Members']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid member ID format." });
  }
  try {
    const memberId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("members")
      .find({ _id: memberId });
    const members = await result.toArray();
    if (members.length === 0) {
      res.status(404).json({ message: "Member not found" });
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(members[0]);
    }
  } catch (err) {
    console.error("Error fetching member:", err);
    res.status(500).json({ message: "Failed to fetch member", error: err.message });
  }
};

const createMember = async (req, res) => {
  //#swagger.tags = ['Members']
  try {
    const member = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      registrationDate: new Date(),
      // Add other relevant member fields
    };

    const response = await mongodb
      .getDatabase()
      .db()
      .collection("members")
      .insertOne(member);
    if (response.acknowledged) {
      res.status(201).json({ message: "Member created successfully", id: response.insertedId });
    } else {
      res.status(500).json({ message: "Failed to create member" });
    }
  } catch (err) {
    console.error("Error creating member:", err);
    res.status(500).json({ message: "Failed to create member", error: err.message });
  }
};

const updateMember = async (req, res) => {
  //#swagger.tags = ['Members']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid member ID format." });
  }

  try {
    const memberId = new ObjectId(req.params.id);
    const member = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      // Update other relevant member fields as needed
    };

    const response = await mongodb
      .getDatabase()
      .db()
      .collection("members")
      .replaceOne({ _id: memberId }, member);
    if (response.modifiedCount > 0) {
      res.status(200).json({ message: "Member updated successfully" });
    } else {
      res.status(404).json({ message: "Member not found or no changes made" });
    }
  } catch (err) {
    console.error("Error updating member:", err);
    res.status(500).json({ message: "Failed to update member", error: err.message });
  }
};

const deleteMember = async (req, res) => {
  //#swagger.tags = ['Members']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid member ID format." });
  }

  try {
    const memberId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("members")
      .deleteOne({ _id: memberId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: "Member deleted successfully" });
    } else {
      res.status(404).json({ message: "Member not found" });
    }
  } catch (err) {
    console.error("Error deleting member:", err);
    res.status(500).json({ message: "Failed to delete member", error: err.message });
  }
};

module.exports = {
  getAllMembers,
  getSingleMember,
  createMember,
  updateMember,
  deleteMember,
};