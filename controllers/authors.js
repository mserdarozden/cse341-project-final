const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags = ['Authors']
    try {
        console.log('Getting all authors');
        const result = await mongodb.getDatabase().db().collection('authors').find();
        const authors = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(authors);
    } catch (err) {
        console.error('Error fetching authors:', err);
        res.status(500).json({ message: 'Failed to fetch authors', error: err.message });
    }
};

const getSingle = async (req, res) => {
    //#swagger.tags = ['Authors']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid author ID format.' });
    }
    try {
        const authorId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('authors').find({ _id: authorId });
        const authors = await result.toArray();
        if (authors.length === 0) {
            res.status(404).json({ message: 'Author not found' });
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(authors[0]);
        }
    } catch (err) {
        console.error('Error fetching author:', err);
        res.status(500).json({ message: 'Failed to fetch author', error: err.message });
    }
};

const createAuthor = async (req, res) => {
    //#swagger.tags = ['Authors']
    try {
        const author = {
            name: req.body.name,
            birthdate: req.body.birthdate,
            nationality: req.body.nationality,
            biography: req.body.biography
        };

        const response = await mongodb.getDatabase().db().collection("authors").insertOne(author);
        if (response.acknowledged) {
            res.status(201).json({ message: 'Author created successfully', id: response.insertedId });
        } else {
            res.status(500).json({ message: 'Failed to create author' });
        }
    } catch (err) {
        console.error('Error creating author:', err);
        res.status(500).json({ message: 'Failed to create author', error: err.message });
    }
};

const updateAuthor = async (req, res) => {
    //#swagger.tags = ['Authors']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid author ID format.' });
    }

    try {
        const authorId = new ObjectId(req.params.id);
        const author = {
            name: req.body.name,
            birthdate: req.body.birthdate,
            nationality: req.body.nationality,
            biography: req.body.biography
        };

        const response = await mongodb.getDatabase().db().collection("authors").replaceOne({ _id: authorId }, author);
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'Author updated successfully' });
        } else {
            res.status(404).json({ message: 'Author not found or no changes made' });
        }
    } catch (err) {
        console.error('Error updating author:', err);
        res.status(500).json({ message: 'Failed to update author', error: err.message });
    }
};

const deleteAuthor = async (req, res) => {
    //#swagger.tags = ['Authors']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid author ID format.' });
    }

    try {
        const authorId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection("authors").deleteOne({ _id: authorId });

        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Author deleted successfully' });
        } else {
            res.status(404).json({ message: 'Author not found' });
        }
    } catch (err) {
        console.error('Error deleting author:', err);
        res.status(500).json({ message: 'Failed to delete author', error: err.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createAuthor,
    updateAuthor,
    deleteAuthor
};
