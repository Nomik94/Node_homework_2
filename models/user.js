'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.user.hasMany(models.comment, { foreignKey: 'user_id' });
      models.user.hasMany(models.post, { foreignKey: 'user_id' });
      models.user.hasMany(models.like, { foreignKey: 'user_id' });
    }
  }
  User.init(
    {
      userId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nickname: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'user',
    }
  );
  return User;
};
