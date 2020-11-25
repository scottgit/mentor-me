'use strict';
const {Model} = require('sequelize');
const {User} = require('./user');

module.exports = (sequelize, DataTypes) => {
  class Connection extends Model {
    static async createPending(connection) {
      if (connection.status !== 'pending') return Error('Connections must begin as pending.')
      const res = await Connection.create({...connection});
      console.log('connection result', res);
      return res;
    }


    static associate(models) {
      // No Associations; this is a Many-to-Many JOIN table on Users
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
