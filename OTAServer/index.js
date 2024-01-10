const express = require("express");
const { networkInterfaces } = require("os");
const path = require("path");
const fs = require("fs");

const app = express();
const nets = networkInterfaces();

// Server port
const PORT = 3000;

//Tally Light
app.get("/tallyLight/firmware/firmware.bin", (request, response) => {
	response.download(path.join(__dirname, "/tallyLight/firmware/firmware.bin"), "firmware.bin", (err) => {
		if (err) {
			console.error("Problem on download firmware: ", err);
		}
	});
	console.log("Your file has been downloaded " + downloadCounter + " times!");
});

app.get("/tallyLight/firmware/version.txt", (request, response) => {
	try {
		const versionPath = path.join(__dirname, "/tallyLight/firmware/version.txt");
		const versionContent = fs.readFileSync(versionPath, "utf8");

		response.send(versionContent);
		response.status(200);
	} catch (err) {
		console.error("Problem reading version.txt: ", err);
		response.status(500).send("Internal Server Error");
	}
});

//Datavideo
app.get("/datavideo/firmware/firmware.bin", (request, response) => {
	response.download(path.join(__dirname, "/datavideo/firmware/firmware.bin"), "firmware.bin", (err) => {
		if (err) {
			console.error("Problem on download firmware: ", err);
		}
	});
});

app.get("/datavideo/firmware/version", (request, response) => {
	try {
		const versionPath = path.join(__dirname, "/datavideo/firmware/version");
		const versionContent = fs.readFileSync(versionPath, "utf8");

		response.send(versionContent);
		response.status(200);
	} catch (err) {
		console.error("Problem reading version: ", err);
		response.status(500).send("Internal Server Error");
	}
});

app.listen(PORT, "192.168.100.222", () => {
	console.log("serving on: http://api.dominikkawalec.pl:3000/datavideo/firmware/version");
});
