'use strict';
const { Model, Validator } = require('sequelize');
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toSafeObject() {
      const { id, username, email } = this; // context will be the User instance
      return { id, username, email };
    }
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }
    static getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
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
    static async signup({ username, email, password, goBy, picture, mentorDesc, menteeDesc }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        username,
        email,
        hashedPassword,
        goBy,
        picture,
        mentorDesc,
        menteeDesc,
      });
      return await User.scope('currentUser').findByPk(user.id);
    };
    static associate(models) {
      // define association here
    }
  };
  User.init(
    {
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: [4, 50],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Username cannot be an email.");
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: [3, 255],
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
      goby: {
        type: DataTypes.STRING(50),
      },
      picture: {
        type: DataTypes.STRING(255),
      },
      mentorDesc: {
        type: DataTypes.TEXT,
        oneDescNotNull(value)
      },
      menteeDesc: {
        type: DataTypes.TEXT,
        oneDescNotNull(value)
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"],
        },
      },
      scopes: {
        currentUser: {
          attributes: { exclude: ["hashedPassword"] },
        },
        loginUser: {
          attributes: {},
        },
      },
    }
  );
  return User;
};

function oneDescNotNull(value) {
  if (!this.mentorDesc && !this.menteeDesc) {
    throw new Error('A description of at least one role as either a mentor or a mentee is required.');
  }
}
