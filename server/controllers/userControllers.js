const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json({ success: true, data: users });
});

const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  res.json({ success: true, data: user });
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;
  const user = await User.create({ name, email, role });
  res.status(201).json({ success: true, data: user });
});

module.exports = { getUsers, getUserById, createUser };