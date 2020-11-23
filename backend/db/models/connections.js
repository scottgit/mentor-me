'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Connection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
