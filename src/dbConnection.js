require('dotenv/config');

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const Sequelize = require('sequelize');

module.exports = new Sequelize('delilah_db', username , password , {
    host: 'localhost',
    dialect: 'mysql',
    logging: false //de este modo consola no mostrara las sentencias SQL. 
});