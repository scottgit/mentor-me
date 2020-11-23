'use strict';
const faker = require("faker");
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'demo@demo.io',
        username: 'Demo-Me',
        hashedPassword: bcrypt.hashSync('password'),
        goBy: 'DemoUser',
        picture: '',
        gender: 'Other',
        mentorDesc: 'I\'ll teach anything!',
        menteeDesc: 'I\'ll learn anything!',
      },
      {
        email: faker.internet.email(),
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync(faker.internet.password()),
        goBy: 'Fakey One',
        picture: '',
        gender: 'Male',
        mentorDesc: '',
        menteeDesc: 'Need to know it all',
        menteeIsPublic: true,
      },
      {
        email: faker.internet.email(),
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync(faker.internet.password()),
        goBy: 'Two Fake',
        picture: '',
        gender: 'Female',
        mentorDesc: 'I know it all',
        mentorIsPublic: true,
        menteeDesc: '',
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['Demo-Me', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
