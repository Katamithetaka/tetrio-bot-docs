import { promises as fs } from "fs";
import fsSync from "fs";
import path from "path";
import Base64ArrayBuffer from "base64-arraybuffer";
import msgpack from "msgpack-lite";

// CONSTANTS
if (process.argv.length < 3) {
    console.log("Usage: " + process.argv[0] + " " + process.argv[1] + " input.har [output (defaults to input.har.logs)]")
    process.exit(0);
}


// input .har file
const har_file = process.argv[2];
// output folder
const output_file = process.argv[3] ? process.argv[3] : process.argv[2] + ".logs"
// har websocket index
const index = 0;

function formatTime(date) {
    // what? you want me to install luxon for *this*?
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    const milliseconds = date.getUTCMilliseconds().toString().padStart(3, "0");
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

async function appendLog(timestamp, type, message) {
    const date = new Date(timestamp * 1000);

    await fs.appendFile(output_file, `[${formatTime(date)} ${type == "send" ? "O" : "I"}] ${JSON.stringify(message)}\n`);
}

// SCRIPT

const data = JSON.parse(await fs.readFile(har_file, "utf-8"));

const folder = path.parse(output_file).dir;

if (!fsSync.existsSync(folder)) {
    await fs.mkdir(folder);
}

await fs.writeFile(output_file, "");

for (let index = 0; index < data.log.entries.length; ++index) {

    if(!("_webSocketMessages" in data.log.entries[index])) {
        continue;
    }

    await fs.appendFile(output_file, `WebSocket from log entries at index ${index}`);

    for (const socketMessage of data.log.entries[index]._webSocketMessages) {
        const arrayBuffer = Base64ArrayBuffer.decode(socketMessage.data);
        const buffer = Buffer.from(arrayBuffer);

        // see Ribbon.md for more information on these headers.

}
    }
