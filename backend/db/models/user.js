'use strict';
const { Model, Validator, models } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toSafeObject() {
      const {
        id,
        username,
        email,
        goBy,
        picture,
        gender,
        mentorDesc,
        mentorIsPublic,
        menteeDesc,
        menteeIsPublic } = this; // context will be the User instance
      return {
        id,
        username,
        email,
        goBy,
        picture,
        gender,
        mentorDesc,
        mentorIsPublic,
        menteeDesc,
        menteeIsPublic,
      };
    }

    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }

    static async getPublicMentors() {
      return await User.scope('publicUser').findAll({
        where: {
          mentorIsPublic: true
        }
      })
    }

    static async getPublicMentees() {
      return await User.scope('publicUser').findAll({
        where: {
          menteeIsPublic: true
        }
      })
    }

    static async getMenteesForId(id) {
      const res = await User.scope('currentUser').findOne({
        where: {id},
        include: [{
          model: User,
          through: 'Connections',
          as: 'mentoring',
          through: {
            attributes: [],
            where: {
              mentorId: id,
              status: 'established'
            },
          }
        }]
      }) ;

      return res.mentoring;
    }

    static async getMentorsForId(id) {
      const res = await User.scope('currentUser').findOne({
        where: {id},
        include: [{
          model: User,
          through: 'Connections',
          as: 'learning',
          through: {
            attributes: [],
            where: {
              userId: id,
              status: 'established',
            },
          }
        }]
      }) ;

      return res.learning;
    }

    static async getCurrentUserById(id) {
      return await User.scope('currentUser').findByPk(id);
    }

    static async getUserById(id) {
      const user = await User.scope('publicUser').findByPk(id);
      return user.toSafeObject()
    }

    static async login({ credential, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential,
          },
        },
      });
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    }

    static async signup({ username, email, password, goBy, picture, gender, mentorDesc, mentorIsPublic, menteeDesc, menteeIsPublic }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        username,
        email,
        hashedPassword,
        goBy,
        picture,
        gender,
        mentorDesc,
        mentorIsPublic,
        menteeDesc,
        menteeIsPublic,
      });
      return await User.scope('currentUser').findByPk(user.id);
    };
    // *** Associations ***
    static associate(models) {
      User.belongsToMany(models.User, {
        through: 'Connections',
        as: 'mentoring',
        foreignKey: 'mentorId',
        otherKey: 'userId'
      });
      User.belongsToMany(models.User, {
        through: 'Connections',
        as: 'learning',
        foreignKey: 'userId',
        otherKey: 'mentorId'
      });
    }
  };
  User.init(
    {
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: [3, 50],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error('Username cannot be an email.');
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: [3, 50],
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
      goBy: {
        type: DataTypes.STRING(20),
      },
      picture: {
        type: DataTypes.STRING(255),
      },
      gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: false
      },
      mentorDesc: {
        type: DataTypes.TEXT,
        oneDescNotNull(value) {
          if (!this.mentorDesc && !this.menteeDesc) {
            throw new Error('A description of at least one role as either a mentor or a mentee is required.');
          }
        },
        publicNeedsDescription(value) {
          if (!this.mentorDesc && this.mentorIsPublic) {
            throw new Error('A mentor available to the public needs a mentor description of what you are willing to mentor in.');
          }
        },
      },
      mentorIsPublic: {
        type: DataTypes.BOOLEAN
      },
      menteeDesc: {
        type: DataTypes.TEXT,
        oneDescNotNull(value) {
          if (!this.mentorDesc && !this.menteeDesc) {
            throw new Error('A description of at least one role as either a mentor or a mentee is required.');
          }
        },
        publicNeedsDescription(value) {
          if (!this.menteeDesc && this.menteeIsPublic) {
            throw new Error('A mentee available to the public needs a mentee description of what you want to learn.');
          }
        },
      },
      menteeIsPublic: {
        type: DataTypes.BOOLEAN
      },
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'],
        },
      },
      scopes: {
        currentUser: {
          attributes: { exclude: ['hashedPassword'] },
        },
        loginUser: {
          attributes: {},
        },
        publicUser: {
          attributes: { exclude: ['hashedPassword', 'email', 'updatedAt'] },
        },
      },
    }
  );
  return User;
};
