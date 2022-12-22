'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('comments', 'post_id', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addConstraint('comments', {
      fields: ['post_id'],
      type: 'foreign key',
      name: 'posts_comments_id_fk',
      references: {
        table: 'posts',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('comments', 'post_id');
  },
};
