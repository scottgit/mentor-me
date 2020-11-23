'use strict';
const faker = require("faker");
const bcrypt = require("bcryptjs");

function getRandom(max) {
  return Math.floor(Math.random() * max);
}

const genderArray = ['Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Female', 'Other']
const users = [
  {
    email: 'demo@demo.io',
    username: 'Demo-Me',
    hashedPassword: bcrypt.hashSync('password'),
    goBy: 'DemoUser',
    picture: '',
    gender: 'Other',
    mentorDesc: 'I\'ll teach anything!',
    mentorIsPublic: true,
    menteeDesc: 'I\'ll learn anything!',
    menteeIsPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'scott@scott.com',
    username: 'Scott Smith',
    hashedPassword: bcrypt.hashSync('password'),
    goBy: 'Scott',
    picture: '',
    gender: 'Male',
    mentorDesc: '',
    mentorIsPublic: false,
    menteeDesc: 'Need to learn it all.',
    menteeIsPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'ian@ian.com',
    username: 'Ian',
    hashedPassword: bcrypt.hashSync('password'),
    goBy: 'Ian',
    picture: '',
    gender: 'Male',
    mentorDesc: 'I know everything about programming.',
    mentorIsPublic: true,
    menteeDesc: '',
    menteeIsPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mentorDescs = [
  'I want to help people seeking to stay on track to overcome substance abuse.',
  'I seek to disciple believers in Jesus Christ.',
  'I desire to help athletes go to the next level in their sport.',
  'I will teach people more about the Bible.',
  'I will challenge people to become better cooks.',
  'I want to help parents grow to be better parents.',
  'I will teach anything!',
  'I desire to simply motivate you in whatever way you need it.',
  'Learn car mechanics through me.',
  'Learn how to paint landscapes.',
  'I help students in whatever subject area they need help with.',
]

const menteeDescs = [
  'I seek a mentor to help overcome an addiction.',
  'I want to learn more about how to be a Christian.',
  'I am a marathon runner wanting to win a race.',
  'I want to learn how to sew.',
  'I need to understand quantum physics in 3 weeks!',
  'I just need help with my life.',
  'Motivation! Help me learn motivation!',
  'Can anyone help me with astronomy?',
]

const offsetMentees = Math.floor(menteeDescs.length/3);
//Keep the total here no more than 100 for photo purposes
const extraUsers = mentorDescs.length + menteeDescs.length - offsetMentees;

module.exports = {
  up: async (queryInterface, Sequelize) => {

    for(let i = 0; i < extraUsers; i++) {

      const createdAt = faker.date.past(3);
      const first = faker.name.firstName();
      const last = faker.name.lastName();
      const gender = genderArray[getRandom(10)];
      const picPre = gender !== 'Male' ? ( gender === 'Female' || gender === 'Other' && getRandom(2) ? 'wo' : '') : '';
      const mentorDesc = i < mentorDescs.length ? mentorDescs[i] : '';
      const menteeDesc = i >= offsetMentees ? menteeDescs[i - offsetMentees] : '';

      users.push({
        username: faker.internet.userName(first, last),
        email: faker.internet.email(first, last),
        hashedPassword: bcrypt.hashSync(faker.internet.password(8, false, null, 'Ca!7'), 10),
        goBy: first+' (Fake)',
        picture: `https://randomuser.me/api/portraits/${picPre}men/${i}.jpg`, //0-99 max on pics
        gender,
        mentorDesc,
        mentorIsPublic: (mentorDesc !== ''),
        menteeDesc,
        menteeIsPublic: (menteeDesc !== ''),
        createdAt,
        updatedAt: faker.date.between(createdAt, faker.date.recent()),
      });
    }

    return queryInterface.bulkInsert('Users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      id: { [Op.lte]: (users.length + extraUsers) }
    }, {});
  }
};
