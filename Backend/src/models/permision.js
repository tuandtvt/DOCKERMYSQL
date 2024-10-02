'use strict';
module.exports = (sequelize, DataTypes) => {
  const Permision = sequelize.define('Permision', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    permision_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
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
    tableName: 'Permisions',
    timestamps: true
  });

  Permision.associate = function(models) {
    Permision.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });
    Permision.belongsToMany(models.Role, {
      through: models.RolePermision,
      foreignKey: 'permision_id',
      as: 'Roles'
    });
  };

  return Permision;
};
