const express = require('express');
const router = express.Router();
const membersController = require('../controllers/members');
const validation = require('../middleware/validate');
const { isAuthenticated } = require("../middleware/authenticate");


router.get('/members', membersController.getAllMembers);
router.get('/members/:id', membersController.getSingleMember);
router.post('/members', membersController.createMember);
router.put('/members/:id', membersController.updateMember);
router.delete('/members/:id', membersController.deleteMember);

module.exports = router;