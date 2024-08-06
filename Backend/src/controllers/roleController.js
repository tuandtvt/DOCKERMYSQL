import roleService from "../services/roleService";

const addRole = async (req, res) => {
  const { role_name, description } = req.body;

  if (!role_name) {
    return res.status(400).json({ message: 'Role name is required' });
  }

  try {
    const newRole = await roleService.createRole(role_name, description);
    res.status(201).json(newRole);
  } catch (error) {
    console.error('Error adding role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const assignRoleToUser = async (req, res) => {
  const { userId } = req.params;
  const { roleId } = req.body;

  try {
    const userRole = await roleService.assignRoleToUser(userId, roleId);
    res.status(201).json(userRole);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  addRole,
  assignRoleToUser
};
