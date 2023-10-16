const Sequelize = require('sequelize');
const path = require('path');
const sequelize = require('../util/database')


const SignUp =  sequelize.define('signup', {
    name: {
        type:Sequelize.STRING,
        allowNull: false
    },
    email:{
     type:Sequelize.STRING,
     unique: true,
     allowNull: false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }

})

module.exports = SignUp;