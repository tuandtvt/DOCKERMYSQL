module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
    tableName: 'UserRoles',
    timestamps: true
  });

  UserRole.associate = function (models) {
    UserRole.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });
    UserRole.belongsTo(models.Role, { foreignKey: 'role_id', as: 'Role' });
  };

  return UserRole;
};
