const { body, param } = require('express-validator');

// USER
const userValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('role').optional().isIn(['ADMIN', 'MEMBER']).withMessage('Role must be ADMIN or MEMBER')
];

// PROJECT
const projectValidationRules = [
  body('name').notEmpty().withMessage('Project name is required'),
  body('status').optional().isIn(['ACTIVE', 'COMPLETED', 'ARCHIVED']).withMessage('Invalid status'),
  body('createdBy').notEmpty().withMessage('createdBy is required').isMongoId().withMessage('createdBy must be a valid ID')
];

// TASK
const taskValidationRules = [
  body('title').notEmpty().withMessage('Task title is required'),
  body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Invalid status'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority'),
  body('project').notEmpty().withMessage('project is required').isMongoId().withMessage('project must be a valid ID'),
  body('createdBy').notEmpty().withMessage('createdBy is required').isMongoId().withMessage('createdBy must be a valid ID'),
  body('dueDate').optional().isISO8601().withMessage('dueDate must be a valid date')
];

// Shared: validate any :id param is a real Mongo ObjectId
const idParamValidation = [
  param('id').isMongoId().withMessage('Invalid ID format')
];

module.exports = {
  userValidationRules,
  projectValidationRules,
  taskValidationRules,
  idParamValidation
};