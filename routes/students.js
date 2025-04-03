const express = require('express');
const router = express.Router();
const validation = require('../middleware/validate');
const { isAuthenticated } = require("../middleware/authenticate");

const studentsController = require('../controllers/students');

router.get('/', studentsController.getAll);

router.get('/:id', studentsController.getSingle);

router.post('/', isAuthenticated, validation.saveStudent, studentsController.createStudent);

router.put('/:id', isAuthenticated, validation.saveStudent, studentsController.updateStudent);

router.delete('/:id', isAuthenticated, studentsController.deleteStudent);

module.exports = router;
