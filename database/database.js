const sequelize = require('sequelize');

const connection = new sequelize('perguntas','root','Si27913010!!', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;