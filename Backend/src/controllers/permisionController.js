import permisionService from "../services/permisionService";
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
const addPermision = asyncHandler(async (req, res) => {
  const { permision_name, description } = req.body;

  if (!permision_name) {
    return res.status(400).json({ message: 'Permision name is required' });
  }
  const newPermision = await permisionService.createPermision(permision_name, description);
  res.status(201).json(newPermision);
});

const assignPermisionToRole = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const { permisionId } = req.body;
  const rolePermision = await permisionService.assignPermisionToRole(roleId, permisionId);
  res.status(201).json(rolePermision);
});

export default {
  addPermision,
  assignPermisionToRole,
};
