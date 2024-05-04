import { promises as fs } from "fs";
import fsSync from "fs";
import path from "path";
import Base64ArrayBuffer from "base64-arraybuffer";

// CONSTANTS

if(process.argv.length < 3) {
    console.log("Usage: " + process.argv[0] + " " + process.argv[1] + " input.har [outputFolder (defaults to ./input.har.bin/)]")
    process.exit(0);
}


// input .har file
const har_file = process.argv[2];
// output folder
const output_folder = process.argv[3] ? process.argv[3] : process.argv[2] + ".bin/"

// SCRIPT

const data = JSON.parse(await fs.readFile(har_file, "utf-8"));

if (!fsSync.existsSync(output_folder)) {
    await fs.mkdir(output_folder);
}


for (let i = 0; i < data.log.entries.length; ++i) {

    if(!("_webSocketMessages" in data.log.entries[i])) {
        continue;
    }

    for (const socketMessage of data.log.entries[i]._webSocketMessages) {
        const time = Math.round(socketMessage.time * 1000000) // shhh
        const filename = time + "-" + socketMessage.type + ".bin";

        const buffer = Base64ArrayBuffer.decode(socketMessage.data);

        await fs.writeFile(path.join(output_folder, filename), Buffer.from(buffer));
    }
}
