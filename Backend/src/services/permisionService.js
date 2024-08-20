const { Role, Permision, RolePermision } = require('../models');
import ERROR_CODES from '../errorCodes';

const createPermision = async (permision_name, description) => {
  try {
    const newPermision = await Permision.create({ permision_name, description });
    return newPermision;
  } catch (error) {
    return { message: ERROR_CODES.PERMISION_CREATION_FAILED };
  }
};

const assignPermisionToRole = async (roleId, permisionId) => {
  const role = await Role.findByPk(roleId);
  if (!role) {
    return { message: ERROR_CODES.ROLE_NOT_FOUND };
  }

  const permision = await Permision.findByPk(permisionId);
  if (!permision) {
    return { message: ERROR_CODES.PERMISION_NOT_FOUND };
  }

  const existingAssignment = await RolePermision.findOne({
    where: {
      role_id: roleId,
      permision_id: permisionId
    }
  });

  if (existingAssignment) {
    return { message: ERROR_CODES.PERMISION_ALREADY_ASSIGNED };
  }

  try {
    const rolePermision = await RolePermision.create({
      role_id: roleId,
      permision_id: permisionId
    });
    return rolePermision;
  } catch (error) {
    return { message: ERROR_CODES.ROLE_PERMISION_CREATION_FAILED };
  }
};

module.exports = {
  createPermision,
  assignPermisionToRole
};
