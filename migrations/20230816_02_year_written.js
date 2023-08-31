const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'postyear', {
      type: DataTypes.INTEGER,
      validate: {
        max: 2023,
        min: 1991
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'postyear')
  },
}