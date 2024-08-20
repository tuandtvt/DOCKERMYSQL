import db from '../models';
import ERROR_CODES from '../errorCodes';

const createRole = async (role_name, description) => {
  try {
    return await db.Role.create({ role_name, description });
  } catch (error) {
    console.error('Service error:', error);
    return { message: ERROR_CODES.SERVER_ERROR };
  }
};

const assignRoleToUser = async (userId, roleId) => {
  try {
    const user = await db.User.findByPk(userId);
    if (!user) {
      return { message: ERROR_CODES.USER_NOT_FOUND };
    }

    const role = await db.Role.findByPk(roleId);
    if (!role) {
      return { message: ERROR_CODES.ROLE_NOT_FOUND };
    }

    const existingAssignment = await db.UserRole.findOne({
      where: {
        user_id: userId,
        role_id: roleId
      }
    });

    if (existingAssignment) {
      return { message: ERROR_CODES.ROLE_ALREADY_ASSIGNED };
    }

    const userRole = await db.UserRole.create({
      user_id: userId,
      role_id: roleId
    });

    return userRole;
  } catch (error) {
    console.error('Service error:', error);
    return { message: ERROR_CODES.SERVER_ERROR };
  }
};

export default {
  createRole,
  assignRoleToUser
};
