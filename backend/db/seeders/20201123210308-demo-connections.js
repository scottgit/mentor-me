'use strict';
const faker = require("faker");

const createdAt = faker.date.past(2);
const connections = [
  { userId: 2,
    mentorId: 1,
    status: 'established',
    initiatorId: 2,
    createdAt,
    updatedAt: createdAt
  },
  { userId: 1,
    mentorId: 3,
    status: 'established',
    initiatorId: 1,
    createdAt,
    updatedAt: createdAt
  },
  { userId: 1,
    mentorId: 4,
    status: 'pending',
    initiatorId: 4,
    createdAt,
    updatedAt: createdAt
  },
  { userId: 1,
    mentorId: 7,
    status: 'established',
    initiatorId: 1,
    createdAt,
    updatedAt: createdAt
  },
  { userId: 2,
    mentorId: 4,
    status: 'pending',
    initiatorId: 4,
    createdAt,
    updatedAt: createdAt
  },
  { userId: 2,
    mentorId: 7,
    status: 'pending',
    initiatorId: 2,
    createdAt,
    updatedAt: createdAt
  },
  { userId: 2,
    mentorId: 8,
    status: 'established',
    initiatorId: 8,
    createdAt,
    updatedAt: createdAt
  },
  { userId: 5,
    mentorId: 3,
    status: 'established',
    initiatorId: 5,
    createdAt,
    updatedAt: createdAt
  },
  { userId: 6,
    mentorId: 3,
    status: 'established',
    initiatorId: 3,
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
