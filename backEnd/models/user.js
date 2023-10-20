const Sequelize = require('sequelize');
const path = require('path');
const sequelize = require('../util/database')


const User =  sequelize.define('user', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:Sequelize.STRING,
    email:{
     type:Sequelize.STRING,
     unique: true,
     allowNull: false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    ispremiumuser: Sequelize.BOOLEAN,
    totalExpense: {
        type: Sequelize.FLOAT, // Adjust the data type as needed
        defaultValue: 0 // Default value for the column
    }
})

module.exports = User;