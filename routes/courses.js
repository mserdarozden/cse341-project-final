const express = require('express');
const router = express.Router();
const validation = require('../middleware/validate');
const { isAuthenticated } = require("../middleware/authenticate");

const coursesController = require('../controllers/courses');

router.get('/', coursesController.getAll);

router.get('/:id', coursesController.getSingle);

router.post('/', isAuthenticated, validation.saveCourse, coursesController.createCourse);

router.put('/:id', isAuthenticated, validation.saveCourse, coursesController.updateCourse);

router.delete('/:id', isAuthenticated, coursesController.deleteCourse);

module.exports = router;
