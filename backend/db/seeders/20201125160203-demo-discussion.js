`use strict`;
const faker = require("faker");
const createdAt = faker.date.recent();

function getRandom(max) {
  return Math.floor(Math.random() * max);
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const discussions =  [
      { connectionId: 1,
        title: `Interest to connect`,
        stream: JSON.stringify([
          {userId: 2, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `I want to learn what you teach. Let\`s connect! ${faker.random.words(20 + getRandom(50))}`},
          {userId: 1, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `Yes, let\`s do it! ${faker.random.words(getRandom(20))}`},
        ]),
        createdAt,
        updatedAt: createdAt
      },
      { connectionId: 2,
        title: `Interest to connect`,
        stream: JSON.stringify([
          {userId: 1, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `Can we connect? ${faker.random.words(20 + getRandom(20))}`},
          {userId: 3, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `What do you want to learn? ${faker.random.words(20 + getRandom(100))}`},
          {userId: 1, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `What you are teaching. ${faker.random.words(30 + getRandom(10))}`}
        ]),
        createdAt,
        updatedAt: createdAt,
      },
      { connectionId: 3,
        title: `Interest to connect`,
        stream: JSON.stringify([
          {userId: 4, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `Maybe we would work well together; can we connect? ${faker.random.words(20 + getRandom(10))}`}
        ]),
        createdAt,
        updatedAt: createdAt
      },
      { connectionId: 4,
        title: `Interest to connect`,
        stream: JSON.stringify([
          {userId: 4, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `Maybe we would work well together; can we connect? ${faker.random.words(getRandom(20))}`},
        ]),
        createdAt,
        updatedAt: createdAt
      },
      { connectionId: 5,
        title: `Interest to connect`,
        stream: JSON.stringify([
          {userId: 4, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `I have some things I can teach you, connect? ${faker.random.words(20 + getRandom(50))}`},
          {userId: 2, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `What things? ${faker.random.words(5 + getRandom(15))}`},
          {userId: 4, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `Stuff ${faker.random.words(5 + getRandom(50))}`},
        ]),
        createdAt,
        updatedAt: createdAt
      },
      { connectionId: 6,
        title: `Interest to connect`,
        stream: JSON.stringify([
          {userId: 2, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `I\`d really like to connect... ${faker.random.words(20 + getRandom(50))}`},
        ]),
        createdAt,
        updatedAt: createdAt
      },
      { connectionId: 7,
        title: `Interest to connect`,
        stream: JSON.stringify([
          {userId: 8, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `My reasons to connect with you are as follows ${faker.random.words(50 + getRandom(50))}`},
        ]),
        createdAt,
        updatedAt: createdAt
      },
      { connectionId: 8,
        title: `Interest to connect`,
        stream: JSON.stringify([
          {userId: 5, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `Connneeeect wiiiiith meeeeee!!!! ${faker.random.words(getRandom(50))}`},
        ]),
        createdAt,
        updatedAt: createdAt
      },
      { connectionId: 9,
        title: `Interest to connect`,
        stream: JSON.stringify([
          {userId: 3, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `I can teach you some things... ${faker.random.words(10)}`},
          {userId: 6, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `What things... ${faker.random.words(20 + getRandom(50))}`},
          {userId: 6, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `Things... ${faker.random.words(20 + getRandom(50))}`},
        ]),
        createdAt,
        updatedAt: createdAt
      },
      { connectionId: 1,
        title: `Going for your first Goal`,
        stream: JSON.stringify([
          {userId: 1, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `So here is my advice... ${faker.random.words(20 + getRandom(50))}`},
          {userId: 2, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `But what about... ? ${faker.random.words(20 + getRandom(50))}`},
          {userId: 2, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `And also, what about...? ${faker.random.words(20 + getRandom(50))}`},
          {userId: 1, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `That\`s something to consider; also ${faker.random.words(20 + getRandom(50))}`},
        ]),
        createdAt,
        updatedAt: createdAt
      },
      { connectionId: 1,
        title: `Where to go next?`,
        stream: JSON.stringify([
          {userId: 2, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `So now that Goal 1 is done, what now? ${faker.random.words(20 + getRandom(50))}`},
          {userId: 1, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `We pursue goal 2 :-) ${faker.random.words(20)}`},
          {userId: 2, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `Okay! ${faker.random.words(5)}`},
        ]),
        createdAt,
        updatedAt: createdAt
      },
      { connectionId: 2,
        title: `So now let us begin`,
        stream: JSON.stringify([
          {userId: 3, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `Go for it ${faker.random.words(20 + getRandom(50))}`},
          {userId: 1, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `I'll do it! ${faker.random.words(20)}`},
          {userId: 1, date: new Date().toLocaleDateString(`en-US`), time: new Date().toLocaleTimeString(`en-US`), message: `One question, though ${faker.random.words(5)}?`},
        ]),
        createdAt,
        updatedAt: createdAt
      },
    ];


    await queryInterface.bulkInsert(`Discussions`, discussions, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(`Discussions`, null, {});
  }
};
