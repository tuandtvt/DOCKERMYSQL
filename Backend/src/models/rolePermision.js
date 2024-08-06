module.exports = (sequelize, DataTypes) => {
  const RolePermision = sequelize.define('RolePermision', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    permision_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Permisions',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
    tableName: 'RolePermisions',
    timestamps: true
  });

  RolePermision.associate = function(models) {
    RolePermision.belongsTo(models.Role, { foreignKey: 'role_id', as: 'Role' });
    RolePermision.belongsTo(models.Permision, { foreignKey: 'permision_id', as: 'Permision' });
  };

  return RolePermision;
};
