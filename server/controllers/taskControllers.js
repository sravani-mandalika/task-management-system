const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const getTasks = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.project) filter.project = req.query.project;
  if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
  if (req.query.search) {
  filter.title = { $regex: req.query.search, $options: 'i' };
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const tasks = await Task.find(filter)
    .populate('project', 'name')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Task.countDocuments(filter);

  res.json({
    success: true,
    data: tasks,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) }
  });
});

const getTaskById = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate('project', 'name')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');
  if (!task) {
    return next(new AppError('Task not found', 404));
  }
  res.json({ success: true, data: task });
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, project, assignedTo, createdBy, dueDate } = req.body;
  const task = await Task.create({ title, description, status, priority, project, assignedTo, createdBy, dueDate });
  res.status(201).json({ success: true, data: task });
});

const updateTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!task) {
    return next(new AppError('Task not found', 404));
  }
  res.json({ success: true, data: task });
});

const deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    return next(new AppError('Task not found', 404));
  }
  res.json({ success: true, message: 'Task deleted' });
});

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };