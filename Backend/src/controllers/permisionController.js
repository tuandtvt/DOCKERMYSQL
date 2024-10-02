import permisionService from "../services/permisionService";
import ERROR_CODES from '../errorCodes';

const addPermision = async (req, res) => {
  try {
    const { permision_name, description } = req.body;

    if (!permision_name) {
      return res.status(400).json({ message: ERROR_CODES.PERMISION_NAME_REQUIRED });
    }

    const newPermision = await permisionService.createPermision(permision_name, description);
    res.status(201).json(newPermision);
  } catch (error) {
    res.status(500).json({ message: error.message || ERROR_CODES.INTERNAL_SERVER_ERROR });
  }
};

const assignPermisionToRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { permisionId } = req.body;

    const rolePermision = await permisionService.assignPermisionToRole(roleId, permisionId);
    res.status(201).json(rolePermision);
  } catch (error) {
    res.status(500).json({ message: error.message || ERROR_CODES.INTERNAL_SERVER_ERROR });
  }
};

export default {
  addPermision,
  assignPermisionToRole,
};
