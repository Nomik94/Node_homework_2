'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.like.belongsTo(models.user, { foreignKey: 'user_id' });
      models.like.belongsTo(models.post, { foreignKey: 'post_id' });
    }
  }
  like.init(
    {
      likeId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: DataTypes.INTEGER,
      post_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'like',
    }
  );
  return like;
};
