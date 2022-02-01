const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('favorite', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    idPokemon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false,
  })
};