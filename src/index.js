"use strict";
exports.__esModule = true;
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var config_1 = require("./config/config");
var port = config_1.config.server.port;
var app = (0, express_1["default"])();
var httpServer = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(httpServer, {});
// console.log(io);
app.get("/", function (req, res) {
    res.sendFile("".concat(__dirname, "/index.html"));
});
var totalUsers = 0;
var id = 0;
io.on("connection", function (socket) {
    console.log("A user connected");
    totalUsers++;
    console.log({ totalUsers: totalUsers });
    id++;
    var clientId = id;
    socket.emit("new client", clientId);
    socket.on("new message", function (message) {
        // console.log(`Client_${clientId} says: ${message}`);
        io.emit("new message", { message: message, clientId: clientId });
    });
    //Whenever someone disconnects this piece of code executed
    socket.on("disconnect", function () {
        console.log("A user disconnected");
        totalUsers--;
        console.log({ totalUsers: totalUsers });
    });
});
httpServer.listen(port, function () {
    console.log("server running on port: ".concat(port));
});
