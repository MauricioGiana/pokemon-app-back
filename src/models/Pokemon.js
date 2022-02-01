const { DataTypes, Model } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('pokemon', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    attack: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    defense: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    speed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    height: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    weight: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: "https://cdn.pixabay.com/photo/2019/11/18/15/46/pokemon-4635112_960_720.png"
    },
    isCreated: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  }, {
    timestamps: false,
  });
};


