"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const config_1 = require("./config/config");
const port = config_1.config.server.port;
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {});
// console.log(io);
app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});
let totalUsers = 0;
let id = 0;
io.on("connection", function (socket) {
    console.log("A user connected");
    totalUsers++;
    console.log({ totalUsers });
    id++;
    const clientId = id;
    socket.emit("new client", clientId);
    socket.on("new message", (message) => {
        // console.log(`Client_${clientId} says: ${message}`);
        io.emit("new message", { message, clientId });
    });
    //Whenever someone disconnects this piece of code executed
    socket.on("disconnect", function () {
        console.log("A user disconnected");
        totalUsers--;
        console.log({ totalUsers });
    });
});
httpServer.listen(port, () => {
    console.log(`server running on port: ${port}`);
});
