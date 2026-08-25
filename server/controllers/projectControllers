const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find()
    .populate('createdBy', 'name email')
    .populate('members', 'name email');
  res.json({ success: true, data: projects });
});

const getProjectById = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('members', 'name email');
  if (!project) {
    return next(new AppError('Project not found', 404));
  }
  res.json({ success: true, data: project });
});

const createProject = asyncHandler(async (req, res) => {
  const { name, description, status, createdBy, members } = req.body;
  const project = await Project.create({ name, description, status, createdBy, members });
  res.status(201).json({ success: true, data: project });
});

const updateProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!project) {
    return next(new AppError('Project not found', 404));
  }
  res.json({ success: true, data: project });
});

const deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    return next(new AppError('Project not found', 404));
  }
  res.json({ success: true, message: 'Project deleted' });
});

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };