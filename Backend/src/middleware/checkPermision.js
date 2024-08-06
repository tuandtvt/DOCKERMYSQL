const { User, Role, Permision } = require('../models');

const checkPermision = (requiredPermision) => async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: [{
        model: Role,
        as: 'Roles',
        include: [{
          model: Permision,
          as: 'Permisions',
          through: { attributes: [] }
        }]
      }],
      raw: false
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userPermisions = [];
    user.Roles.forEach(role => {
      role.Permisions.forEach(permision => {
        userPermisions.push(permision.permision_name);
      });
    });

    if (!userPermisions.includes(requiredPermision)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  } catch (error) {
    console.error('Error in checkPermision middleware:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = checkPermision;
