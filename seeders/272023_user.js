'use strict';
const { hash } = require("../helper");
module.exports = {
  async up(queryInterface, Sequelize) {
    const timeNow = new Date();
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Diory Pribadi Sinaga",
          password: hash("Diory123!"),
          email: "diorypribadisinaga@upi.edu",
          role: "superadmin",
          status: "active",
          createdAt: timeNow,
          updatedAt: timeNow,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};