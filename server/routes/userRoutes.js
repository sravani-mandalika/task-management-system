const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser } = require('../controllers/userControllers');
const validate = require('../middleware/validate');
const { userValidationRules, idParamValidation } = require('../middleware/validator');

router.get('/', getUsers);
router.get('/:id', idParamValidation, validate, getUserById);
router.post('/', userValidationRules, validate, createUser);

module.exports = router;