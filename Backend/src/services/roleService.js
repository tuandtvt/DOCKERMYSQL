import db from '../models';

const createRole = async (role_name, description) => {
  return await db.Role.create({ role_name, description });
};

const assignRoleToUser = async (userId, roleId) => {
  const user = await db.User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const role = await db.Role.findByPk(roleId);
  if (!role) {
    throw new Error('Role not found');
  }

  const existingAssignment = await db.UserRole.findOne({
    where: {
      user_id: userId,
      role_id: roleId
    }
  });

  if (existingAssignment) {
    throw new Error('Role is already assigned to the user');
  }
  
  const userRole = await db.UserRole.create({
    user_id: userId,
    role_id: roleId
  });

  return userRole;
};

export default {
  createRole,
  assignRoleToUser
};
