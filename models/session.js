const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Session extends Model {}

Session.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tokenString: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   admin: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false
//   },
//   disabled: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false
//   },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'session'
})

module.exports = Session