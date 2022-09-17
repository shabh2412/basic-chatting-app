import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./config/config";
import { MessageType } from "./types/types";
const port = config.server.port;

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {});
// console.log(io);

app.get("/", (req, res) => {
	res.sendFile(`${__dirname}/index.html`);
});

let totalUsers = 0;
let id = 0;
const history: MessageType[] = [];

io.on("connection", function (socket) {
	console.log("A user connected");
	totalUsers++;
	console.log({ totalUsers });
	id++;
	const clientId = id;
	socket.emit("new client", { clientId, history });

	socket.on("new message", (message: string) => {
		// console.log(`Client_${clientId} says: ${message}`);
		const msg: MessageType = {
			message,
			clientId,
		};
		history.push(msg);
		io.emit("new message", msg);
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
