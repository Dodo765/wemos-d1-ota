const express = require("express");
const { networkInterfaces } = require("os");

const app = express();
const nets = networkInterfaces();

// Server port
const PORT = 3000;

app.get("/", (request, response) => response.send("Hello from www.mischianti.org!"));

app.listen(PORT, () => {
	const results = {}; // Or just '{}', an empty object

	for (const name of Object.keys(nets)) {
		for (const net of nets[name]) {
			// Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
			if (net.family === "IPv4" && !net.internal) {
				if (!results[name]) {
					results[name] = [];
				}
				results[name].push(net.address);
			}
		}
	}

	console.log("Listening on port " + PORT + "\n", results);
});