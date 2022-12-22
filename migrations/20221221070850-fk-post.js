'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('posts', 'user_id', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addConstraint('posts', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'users_posts_id_fk',
      references: {
        table: 'users',
        field: 'userId',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('posts', 'user_id');
  },
};
