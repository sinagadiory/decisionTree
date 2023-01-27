'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Earthquake extends Model {

  }
  Earthquake.init({
    lokasi: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Lokasi tidak boleh kosong",
        },
      },
    },
    kekuatanGempa: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Kekuatan gempa tidak boleh kosong",
        },
      },
    },
    kedalamanGempa: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Kedalaman gempa tidak boleh kosong",
        },
      },
    },
    jarakGempa: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Jarak pusat gempa tidak boleh kosong",
        },
      },
    },
    dampakGempa: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Dampak gempa tidak boleh kosong",
        },
      },
    }
  }, {
    sequelize,
    modelName: 'Earthquake',
  });
  return Earthquake;
};