'use strict';
const {Model} = require('sequelize');
const {User} = require('./user');

module.exports = (sequelize, DataTypes) => {
  class Connection extends Model {
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
    status: DataTypes.ENUM('pending', 'established', 'rejected')
  }, {
    sequelize,
    modelName: 'Connection',
  });
  return Connection;
};
