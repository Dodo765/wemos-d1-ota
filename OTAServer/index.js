const express = require("express");
const { networkInterfaces } = require("os");
const path = require("path");
const fs = require("fs");

const app = express();
const nets = networkInterfaces();

// Server port
const PORT = 3000;

let downloadCounter = 1;
app.get("/tallyLight/firmware/firmware.bin", (request, response) => {
	response.download(path.join(__dirname, "/tallyLight/firmware/firmware.bin"), "firmware.bin", (err) => {
		if (err) {
			console.error("Problem on download firmware: ", err);
		} else {
			downloadCounter++;
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

app.listen(PORT, "192.168.100.222");
