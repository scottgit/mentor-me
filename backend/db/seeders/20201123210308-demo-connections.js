'use strict';
const faker = require("faker");

const createdAt = faker.date.past(2);
const connections = [
  { userId: 1,
    mentorId: 4,
    status: 'established',
    createdAt,
    updatedAt: createdAt
  },
  { userId: 5,
    mentorId: 1,
    status: 'established',
    createdAt,
    updatedAt: createdAt
  },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Connections', connections, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Connections', {
      id: { [Op.lte]: (connections.length) }
    }, {});

  }
};
