'use strict';
const {Model} = require('sequelize');
const {User} = require('./user');

module.exports = (sequelize, DataTypes) => {
  class Connection extends Model {
    static async createPending(connection) {
      if (connection.status !== 'pending') return Error('Connections must begin as pending.')
      const res = await Connection.create({...connection});
      return res;
    }
    static async changeStatus(id, status) {

      const connection = await Connection.findByPk(id);
      connection.status = status;
      const res = await connection.save();
      return res;
    }
    static async delete(id) {
      const connection = await Connection.findByPk(id);
      await connection.destroy();
      const confirm = await Connection.findByPk(id);
      return confirm; //Should be null
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
