import ytdl from "ytdl-core";
import fs from "fs";
import { logger } from "../utils/logger.js";
import path from "path";

export async function fetchVideo(url, quality = "highest") {
return new Promise(async (resolve, reject) => {
try {
const info = await ytdl.getInfo(url);
const title = info.videoDetails.title.replace(/[^\w\d-]+/g, "_");
const tempFile = path.join(process.cwd(), `${title}_${Date.now()}.mp4`);
const stream = ytdl(url, { quality });

const writeStream = fs.createWriteStream(tempFile);
stream.pipe(writeStream);

writeStream.on("finish", () => {
logger.info(`Downloaded: ${tempFile}`);
resolve(tempFile);
});

stream.on("error", reject);
} catch (err) {
reject(err);
}
});
}