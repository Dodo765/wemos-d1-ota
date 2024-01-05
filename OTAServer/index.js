const express = require("express");
const { networkInterfaces } = require("os");
const path = require("path");
const fs = require("fs");

const app = express();
const nets = networkInterfaces();

// Server port
const PORT = 3000;

app.get("/", (request, response) => response.send("Hello from www.mischianti.org!"));

let downloadCounter = 1;
app.get("/firmware/httpUpdateNew.bin", (request, response) => {
	response.download(path.join(__dirname, "firmware/httpUpdateNew.bin"), "httpUpdateNew.bin", (err) => {
		if (err) {
			console.error("Problem on download firmware: ", err);
		} else {
			downloadCounter++;
		}
	});
	console.log("Your file has been downloaded " + downloadCounter + " times!");
});

app.get("/firmware/version.txt", (request, response) => {
	try {
		const versionPath = path.join(__dirname, "firmware/version.txt");
		const versionContent = fs.readFileSync(versionPath, "utf8");

		response.send(versionContent);
		response.status(200);
	} catch (err) {
		console.error("Problem reading version.txt: ", err);
		response.status(500).send("Internal Server Error");
	}
});

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
