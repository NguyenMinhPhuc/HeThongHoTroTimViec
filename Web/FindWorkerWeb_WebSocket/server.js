const express = require('express');

const app = express();

const server = require("http").createServer(app);
require("./socket.io/core")(server);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

server.listen(process.env.PORT || 4000, () => console.log(`Web API listening on port ${4000}!`));