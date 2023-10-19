const { DataTypes } = require('sequelize');
const sequelize = require('../util/database'); 
const Expense = sequelize.define('Expense', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
  money: {
    type: DataTypes.DOUBLE, 
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Expense.sync({ force: true })
//   .then(() => {
//     console.log('Expense table created with force option.');
//   })
//   .catch((err) => {
//     console.error('Error creating the Expense table:', err);
//   });

module.exports = Expense;