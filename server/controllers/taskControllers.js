const Task = require('../models/Task');
const mongoose = require('mongoose');

// GET /api/tasks  (with filtering + pagination)
const getTasks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.project) filter.project = req.query.project;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

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
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, project, assignedTo, createdBy, dueDate } = req.body;
    if (!title || !project || !createdBy) {
      return res.status(400).json({ success: false, message: 'Title, project, and createdBy are required' });
    }
    const task = await Task.create({
      title, description, status, priority, project, assignedTo, createdBy, dueDate
    });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };