"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      hashedPassword: {
        type: Sequelize.STRING.BINARY,
        allowNull: false,
      },
      goBy: {
        type: Sequelize.STRING(20),
      },
      picture: {
        type: Sequelize.STRING(255),
      },
      gender:{
        type: Sequelize.ENUM('Male', 'Female', 'Other'),
        allowNull: false
      },
      mentorDesc: {
        type: Sequelize.TEXT,
      },
      mentorIsPublic: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      menteeDesc: {
        type: Sequelize.TEXT
      },
      menteeIsPublic: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Users");
  },
};
