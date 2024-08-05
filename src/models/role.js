module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'Roles',
    timestamps: true
  });

  Role.associate = function(models) {
    Role.belongsToMany(models.User, {
      through: 'UserRoles',
      foreignKey: 'role_id',
      as: 'Users'
    });
    Role.belongsToMany(models.Permision, {
      through: models.RolePermision,
      foreignKey: 'role_id',
      as: 'Permisions'
    });
  };

  return Role;
};
