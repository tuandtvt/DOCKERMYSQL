module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    notificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'user',
    timestamps: false
  });

  User.associate = function (models) {
    User.belongsToMany(models.Role, {
      through: 'UserRoles',
      foreignKey: 'user_id',
      as: 'Roles'
    });

    User.hasMany(models.Order, { foreignKey: 'user_id' });

    User.hasMany(models.Review, { foreignKey: 'user_id', as: 'reviews' });

    User.hasMany(models.ShopUser, { foreignKey: 'user_id', as: 'ShopUsers' });
  };

  return User;
};
