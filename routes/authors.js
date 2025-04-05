const express = require('express');
const router = express.Router();
const validation = require('../middleware/validate');
const { isAuthenticated } = require("../middleware/authenticate");

const authorsController = require('../controllers/authors');

router.get('/', authorsController.getAll);

router.get('/:id', authorsController.getSingle);

router.post('/', isAuthenticated, validation.saveAuthor, authorsController.createAuthor);

router.put('/:id', isAuthenticated, validation.saveAuthor, authorsController.updateAuthor);

router.delete('/:id', isAuthenticated, authorsController.deleteAuthor);

module.exports = router;
