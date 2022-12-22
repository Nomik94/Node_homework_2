'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.post.hasMany(models.comment, { foreignKey: 'post_id' });
      models.post.hasMany(models.like, { foreignKey: 'post_id' });
      models.post.belongsTo(models.user, { foreignKey: 'user_id' });
    }
  }
  Post.init(
    {
      postId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      user_id: {
        type: DataTypes.INTEGER,
      },
      like_cnt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'post',
    }
  );
  return Post;
};
