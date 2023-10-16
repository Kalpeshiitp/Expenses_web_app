const Sequelize = require('sequelize');


const sequelize = new Sequelize('node-complete1', 'root', 'root123', {
  dialect: 'mysql',
  host: 'localhost',
});

sequelize.sync()
  .then(() => {
    console.log('User model synced with the database');
  })
  .catch((error) => {
    console.error('Error syncing User model:', error);
  });
  
module.exports = sequelize;
