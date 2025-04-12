const express = require('express');
const router = express.Router();
const membersController = require('../controllers/members');
const validation = require('../middleware/validate');
const { isAuthenticated } = require("../middleware/authenticate");


router.get('/', membersController.getAllMembers);
router.get('/:id', membersController.getSingleMember);
router.post('/', membersController.createMember);
router.put('/:id', membersController.updateMember);
router.delete('/:id', membersController.deleteMember);

module.exports = router;