'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('comments', 'user_id', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addConstraint('comments', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'users_comments_id_fk',
      references: {
        table: 'users',
        field: 'userId',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('comments', 'user_id');
  },
};
