import roleService from "../services/roleService";
import ERROR_CODES from '../errorCodes';

const addRole = async (req, res) => {
  const { role_name, description } = req.body;
  if (!role_name) {
    return res.status(400).json({ message: ERROR_CODES.ROLE_NAME_REQUIRED });
  }
  const newRole = await roleService.createRole(role_name, description);
  res.status(201).json(newRole);
};

const assignRoleToUser = async (req, res) => {
  const { userId } = req.params;
  const { roleId } = req.body;

  const result = await roleService.assignRoleToUser(userId, roleId);

  res.status(201).json(result);
};

export default {
  addRole,
  assignRoleToUser
};
