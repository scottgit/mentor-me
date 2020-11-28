'use strict';
const {Op} = require('sequelize');

const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');

module.exports = (sequelize, DataTypes) => {
  class Discussion extends Model {
    static async new(discussion) {
      const res = await Discussion.create({...discussion});
      return res;
    }

    static async getAll(keyId, oneConnect = false) {
      let connections;
      if (oneConnect) {
        connections = await models.Connection.findByPk(
          keyId,
          {attributes: ['id']}
          );
        connections = [connections];
      }
      else {
        connections = await models.Connection.findAll({
          where: {
            [Op.or]: [{userId, mentorId: userId}],
          },
          attributes: ['id']
        })
      }

      return await Discussion.findAll({
        where: {
          connectionId: {[Op.in]: connections}
        }
      });
    }

    static async getAllDiscussionIdsTitles(connectionId, status) {
      if (status) status = status.split(',');
      let include = undefined;
      if (status) include = {
          model: sequelize.models.Connection,
          attributes: [],
          where: {
            status
          }
        }

      return await Discussion.findAll({
        where: {
          connectionId,
        },
        include,
        attributes: ['id', 'title', [sequelize.col('Connection.status'), 'status']]
      });
    }

    static async getOne(id) {
      return await Discussion.findByPk(id);
    }

    static async updateStream(id, stream) {
      const discussion = await Discussion.findByPk(id);
      discussion.stream = stream;
      await discussion.save();
      return discussion;
    }

    static async delete(id) {
      const discussion = await Discussion.findByPk(id);
      await discussion.destroy();
      const confirm = await Discussion.findByPk(id);
      return confirm; //Should be null
    }

    static associate(models) {
      Discussion.belongsTo(models.Connection, {foreignKey: 'connectionId'})
    }
  };
  Discussion.init({
    connectionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model: 'Connection'},
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
