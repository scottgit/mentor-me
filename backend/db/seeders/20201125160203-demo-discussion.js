'use strict';
const faker = require("faker");
const createdAt = faker.date.recent();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const discussions =  [
      { connectionId: 1,
        title: 'Interest to connect',
        stream: JSON.stringify({[{username: 4}]}),
        createdAt,
        updatedAt: createdAt
      },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
    ];


    await queryInterface.bulkInsert('Discussions', discussions, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Discussions', null, {});
  }
};
