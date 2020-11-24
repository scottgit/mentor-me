'use strict';
const {Model} = require('sequelize');
const {User} = require('./user');

module.exports = (sequelize, DataTypes) => {
  class Connection extends Model {
    static async createPending(mentorId, menteeId, initiatorId) {
      const connection = await Connection.create({
        status: 'pending',
        mentorId,
        userId: menteeId,
        initiatorId
      });
      return connection;
    }
    static associate(models) {
      // No Associations
    }
  };
  Connection.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model: "User"},
    },
    mentorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model: "User"},
    },
    status: DataTypes.ENUM('pending', 'established', 'rejected'),
    initiatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Connection',
  });
  return Connection;
};
