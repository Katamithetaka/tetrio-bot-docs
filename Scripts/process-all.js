

import { execSync, spawn } from "child_process";
import { promises as fs } from "fs";
import { join } from "path";


const files = (await fs.readdir("./0har")).filter(f => f.endsWith('.har'));

const dumpHarScript = join(process.cwd(), "dump-har-bin.js");
const logHarWebsocketScript = join(process.cwd(), "log-har-websocket.js");


async function dumpHarBin(fileName)  {
    const p = execSync(process.argv[0] +  " " + dumpHarScript + " './0har/" + fileName + "' './0bin/" + fileName + "/'");
}

async function logHar(fileName)  {
    const p = execSync(process.argv[0] + " " + logHarWebsocketScript + " './0har/" + fileName + "' './0logs/" + fileName + ".logs'");
}


for(const file of files) {
    dumpHarBin(file);
    logHar(file);

}