var mysql = require('mysql');

var config = require('../configs/config.json').dtbTimTho;

var connection = mysql.createPool({
    connectionLimit: 10,
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database
});

module.exports = {connection};