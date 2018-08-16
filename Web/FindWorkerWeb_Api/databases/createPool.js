var mysql = require('mysql');

var connection = mysql.createPool({
    connectionLimit: 10,
    host: process.env.FW_HOST,
    user: process.env.FW_USER,
    port: process.env.FW_PORT,
    password: process.env.FW_PASS,
    database: process.env.FW_DATABASE
});

module.exports = {connection};