const { User, Role } = require('../models');

const checkRole = (requiredRole) => async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: [{
        model: Role,
        as: 'Roles',
        through: { attributes: [] }
      }],
      raw: false
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const roles = user.Roles.map(role => role.role_name);

    if (!roles.includes(requiredRole)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  } catch (error) {
    console.error('Error in checkRole middleware:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = checkRole;
