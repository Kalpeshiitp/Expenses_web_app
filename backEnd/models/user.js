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
    ispremiumuser: Sequelize.BOOLEAN
})

// User.sync({ force: true })
//   .then(() => {
//     console.log('user table created with force option.');
//   })
//   .catch((err) => {
//     console.error('Error creating the user table:', err);
//   });

module.exports = User;