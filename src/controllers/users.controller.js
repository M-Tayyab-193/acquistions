import logger from '#config/logger.js';
import {
  fetchAllUsers,
  getUserById as getUserByIdService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from '#services/users.service.js';
import {
  userIdSchema,
  updateUserSchema,
} from '#validations/users.validation.js';
import { formatValidationErrors } from '#utils/format.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await fetchAllUsers();
    if (allUsers.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json({
      users: allUsers,
      count: allUsers.length,
    });
  } catch (error) {
    logger.error('Error in getAllUsers controller:', error);
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse(req.params);

    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation errors',
        detail: formatValidationErrors(validationResult.error),
      });
    }

    const { id } = validationResult.data;

    const user = await getUserByIdService(id);

    res.status(200).json({
      user,
    });
  } catch (error) {
    logger.error('Error in getUserById controller:', error);

    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }

    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const paramsValidation = userIdSchema.safeParse(req.params);

    if (!paramsValidation.success) {
      return res.status(400).json({
        message: 'Validation errors',
        detail: formatValidationErrors(paramsValidation.error),
      });
    }

    const bodyValidation = updateUserSchema.safeParse(req.body);

    if (!bodyValidation.success) {
      return res.status(400).json({
        message: 'Validation errors',
        detail: formatValidationErrors(bodyValidation.error),
      });
    }

    const { id } = paramsValidation.data;
    const updates = bodyValidation.data;

    // Authorization: Users can only update their own information
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'You do not have permission to update this user',
      });
    }

    // Only admins can update the role field
    if (updates.role && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Only administrators can update user roles',
      });
    }

    const updatedUser = await updateUserService(id, updates);

    logger.info(`User ${id} updated by user ${req.user.id}`);
    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    logger.error('Error in updateUser controller:', error);

    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }

    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse(req.params);

    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation errors',
        detail: formatValidationErrors(validationResult.error),
      });
    }

    const { id } = validationResult.data;

    // Authorization: Only admins can delete users
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Only administrators can delete users',
      });
    }

    await deleteUserService(id);

    logger.info(`User ${id} deleted by admin ${req.user.id}`);
    res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    logger.error('Error in deleteUser controller:', error);

    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }

    next(error);
  }
};
