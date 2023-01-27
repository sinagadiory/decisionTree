'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Earthquakes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lokasi: {
        type: Sequelize.STRING
      },
      kekuatanGempa: {
        type: Sequelize.FLOAT,
      },
      kedalamanGempa: {
        type: Sequelize.FLOAT,
      },
      jarakGempa: {
        type: Sequelize.FLOAT
      },
      dampakGempa: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Earthquakes');
  }
};