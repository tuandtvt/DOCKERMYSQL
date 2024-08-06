import permisionService from "../services/permisionService";

const addPermision = async (req, res) => {
  const { permision_name, description } = req.body;

  if (!permision_name) {
    return res.status(400).json({ message: 'Permision name is required' });
  }

  try {
    const newPermision = await permisionService.createPermision(permision_name, description);
    res.status(201).json(newPermision);
  } catch (error) {
    console.error('Error adding permision:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const assignPermisionToRole = async (req, res) => {
  const { roleId } = req.params;
  const { permisionId } = req.body;

  try {
    const rolePermision = await permisionService.assignPermisionToRole(roleId, permisionId);
    res.status(201).json(rolePermision);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  addPermision,
  assignPermisionToRole,
};
