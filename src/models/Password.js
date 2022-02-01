const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('password', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
  })
};