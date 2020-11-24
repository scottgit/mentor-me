'use strict';
const {Model} = require('sequelize');
const {User} = require('./user');

module.exports = (sequelize, DataTypes) => {
  class Connection extends Model {
    static async getMenteesForId(id) {
      const connections = await Connection.findAll({
        where: {
          mentorId: id,
        },
        attributes: ['status', 'userId'],
      }) ;

      // const mentees = [];
      // if (connections) connections.forEach(async connection => {
      //   const mentee = await sequelize.models.User.getUserById(connection.userId)
      //   console.log('***MENTEE', mentee);
      //   mentees.push(mentee);
      // });
      // return await connections;
    }

    static getMentorsForId(id) {
      return Connection.findAll({
        where: {
          userId: id,
        },
        attributes: ['status', 'mentorId'],
      }) ;
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
    status: DataTypes.ENUM('pending', 'established', 'rejected')
  }, {
    sequelize,
    modelName: 'Connection',
  });
  return Connection;
};
