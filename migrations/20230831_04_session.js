const { DataTypes } = require('sequelize')


module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('sessions', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            token_string: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            created_at: {
                type: DataTypes.DATE
            },
            updated_at: {
                type: DataTypes.DATE
            }
        })
        await queryInterface.addColumn('sessions', 'user_id', {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' },
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('sessions')
    },
}