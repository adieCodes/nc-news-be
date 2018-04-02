const router = require('express').Router();
const { getUser, getAllUsers } = require('../controllers/users.controller.js');

router.get('/', getAllUsers);
router.get('/:username', getUser);

module.exports = router;
