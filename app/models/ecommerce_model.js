const Sequelize = require('sequelize');
const { sequelize } = require('.');

module.exports = (sequelize, Sequelize) => {

    const User = sequelize.define("User", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },

        phone_number: {
            type: Sequelize.INTEGER,
            allowNull: false
        }

    }, { 
        timestamps: false
    });

    return {
        User
    }
}