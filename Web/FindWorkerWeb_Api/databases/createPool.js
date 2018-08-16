var mysql = require('mysql');

var connection = mysql.createPool({
    connectionLimit: 10,
    host: process.env.HOST,
    user: process.env.USER,
    port: 3306,
    password: process.env.PASS,
    database: process.env.DATABASE
});

module.exports = {connection};