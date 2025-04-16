// Controller for the 'events' collection
const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAllEvents = async (req, res) => {
  //#swagger.tags = ['Events']
  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("events")
      .find();
    const events = await result.toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Failed to fetch events", error: err.message });
  }
};

const getSingleEvent = async (req, res) => {
  //#swagger.tags = ['Events']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid event ID format." });
  }
  try {
    const eventId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("events")
      .find({ _id: eventId });
    const events = await result.toArray();
    if (events.length === 0) {
      res.status(404).json({ message: "Event not found" });
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(events[0]);
    }
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ message: "Failed to fetch event", error: err.message });
  }
};

const createEvent = async (req, res) => {
  //#swagger.tags = ['Events']
  try {
    const event = {
      eventName: req.body.eventName,
      eventDate: req.body.eventDate,
      location: req.body.location,
      description: req.body.description,
      capacity: req.body.capacity,
      organizer: req.body.organizer,
    };

    const response = await mongodb
      .getDatabase()
      .db()
      .collection("events")
      .insertOne(event);
    if (response.acknowledged) {
      res.status(201).json({ message: "Event created successfully", id: response.insertedId });
    } else {
      res.status(500).json({ message: "Failed to create event" });
    }
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Failed to create event", error: err.message });
  }
};

const updateEvent = async (req, res) => {
  //#swagger.tags = ['Events']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid event ID format." });
  }

  try {
    const eventId = new ObjectId(req.params.id);
    const event = {
      eventName: req.body.eventName,
      eventDate: req.body.eventDate,
      location: req.body.location,
      description: req.body.description,
      capacity: req.body.capacity,
      organizer: req.body.organizer,
    };

    const response = await mongodb
      .getDatabase()
      .db()
      .collection("events")
      .replaceOne({ _id: eventId }, event);
    if (response.modifiedCount > 0) {
      res.status(200).json({ message: "Event updated successfully" });
    } else {
      res.status(404).json({ message: "Event not found or no changes made" });
    }
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: "Failed to update event", error: err.message });
  }
};

const deleteEvent = async (req, res) => {
  //#swagger.tags = ['Events']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid event ID format." });
  }

  try {
    const eventId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("events")
      .deleteOne({ _id: eventId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: "Event deleted successfully" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Failed to delete event", error: err.message });
  }
};

module.exports = {
  getAllEvents,
  getSingleEvent,
  createEvent,
  updateEvent,
  deleteEvent,
};