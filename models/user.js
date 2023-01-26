'use strict';
const {
  Model
} = require('sequelize');

const { hash } = require("../helper");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Nama tidak boleh kosong",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Email tidak boleh null",
        },
        notEmpty: {
          msg: "Email tidak boleh kosong",
        },
        isEmail: {
          msg: "Format Email Salah",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password tidak boleh null",
        },
        notEmpty: {
          msg: "Password tidak boleh kosong",
        },
        is: {
          args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          msg: "Password minimum delapan karakter, setidaknya satu huruf besar, satu huruf kecil, satu angka dan satu karakter khusus"
        }
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Role cannot be omitted",
        },
        notEmpty: {
          msg: "Role cannot be an empty string",
        },
        isIn: [['superadmin', 'admin']],
      },
    },

  }, {
    hooks: {
      beforeCreate(user) {
        user.password = hash(user.password);
      },
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};