import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#controllers/users.controller.js';
import express from 'express';
import { authenticate } from '#middlewares/auth.middleware.js';

const userRoutes = express.Router();

userRoutes.get('/', getAllUsers);

userRoutes.get('/:id', authenticate, getUserById);

userRoutes.put('/:id', authenticate, updateUser);

userRoutes.delete('/:id', authenticate, deleteUser);

export default userRoutes;
