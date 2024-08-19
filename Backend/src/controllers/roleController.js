import roleService from "../services/roleService";
import CustomError from '../utils/CustomError';

const handleErrors = (res, error) => {
  if (error instanceof CustomError) {
    res.status(error.status || 400).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => handleErrors(res, error));
};

const addRole = asyncHandler(async (req, res) => {
  const { role_name, description } = req.body;
  if (!role_name) {
    return res.status(400).json({ message: 'Role name is required' });
  }
  const newRole = await roleService.createRole(role_name, description);
  res.status(201).json(newRole);
});

const assignRoleToUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { roleId } = req.body;
  const userRole = await roleService.assignRoleToUser(userId, roleId);
  res.status(201).json(userRole);
});

export default {
  addRole,
  assignRoleToUser
};
