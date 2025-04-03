const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags = ['Courses']
    try {
        console.log('Getting all courses');
        const result = await mongodb.getDatabase().db().collection('courses').find();
        const courses = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(courses);
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
    }
};

const getSingle = async (req, res) => {
    //#swagger.tags = ['Courses']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid course ID format.' });
    }
    try {
        const courseId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('courses').find({ _id: courseId });
        const courses = await result.toArray();
        if (courses.length === 0) {
            res.status(404).json({ message: 'Course not found' });
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(courses[0]);
        }
    } catch (err) {
        console.error('Error fetching course:', err);
        res.status(500).json({ message: 'Failed to fetch course', error: err.message });
    }
};

const createCourse = async (req, res) => {
    //#swagger.tags = ['Courses']
    try {
        const course = {
            title: req.body.title,
            description: req.body.description,
            credits: req.body.credits,
            teacher_name: req.body.teacherName
        };

        const response = await mongodb.getDatabase().db().collection("courses").insertOne(course);
        if (response.acknowledged) {
            res.status(201).json({ message: 'Course created successfully', id: response.insertedId });
        } else {
            res.status(500).json({ message: 'Failed to create course' });
        }
    } catch (err) {
        console.error('Error creating course:', err);
        res.status(500).json({ message: 'Failed to create course', error: err.message });
    }
};

const updateCourse = async (req, res) => {
    //#swagger.tags = ['Courses']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid course ID format.' });
    }

    try {
        const courseId = new ObjectId(req.params.id);
        const course = {
            title: req.body.title,
            description: req.body.description,
            credits: req.body.credits,
            teacher_name: req.body.teacherName
        };

        const response = await mongodb.getDatabase().db().collection("courses").replaceOne({ _id: courseId }, course);
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'Course updated successfully' });
        } else {
            res.status(404).json({ message: 'Course not found or no changes made' });
        }
    } catch (err) {
        console.error('Error updating course:', err);
        res.status(500).json({ message: 'Failed to update course', error: err.message });
    }
};

const deleteCourse = async (req, res) => {
    //#swagger.tags = ['Courses']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid course ID format.' });
    }

    try {
        const courseId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection("courses").deleteOne({ _id: courseId });

        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Course deleted successfully' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (err) {
        console.error('Error deleting course:', err);
        res.status(500).json({ message: 'Failed to delete course', error: err.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createCourse,
    updateCourse,
    deleteCourse
};
