import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
const port = process.env.port || 3000;

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {});
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

	socket.on("new message", (message: string) => {
		// console.log(`Client_${clientId} says: ${message}`);
		io.emit("new message", message);
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
