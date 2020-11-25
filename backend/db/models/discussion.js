'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Discussion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Discussion.init({
    connectionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model: "Connection"},
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    stream: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Discussion',
  });
  return Discussion;
};
