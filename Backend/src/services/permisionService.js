const { Role, Permision, RolePermision } = require('../models');

const createPermision = async (permision_name, description) => {
  return await Permision.create({ permision_name, description });
};

const assignPermisionToRole = async (roleId, permisionId) => {

  const role = await Role.findByPk(roleId);
  if (!role) {
    throw new Error('Role not found');
  }

  const permision = await Permision.findByPk(permisionId);
  if (!permision) {
    throw new Error('Permission not found');
  }

  const existingAssignment = await RolePermision.findOne({
    where: {
      role_id: roleId,
      permision_id: permisionId
    }
  });

  if (existingAssignment) {
    throw new Error('Permission is already assigned to the role');
  }


  const rolePermision = await RolePermision.create({
    role_id: roleId,
    permision_id: permisionId
  });

  return rolePermision;
};

module.exports = {
  createPermision,
  assignPermisionToRole
};
