import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import { logger } from "../utils/logger.js";

export function convertVideo(inputFile, format, outputName) {
return new Promise((resolve, reject) => {
const outputFile = path.join(process.cwd(), `${outputName}.${format}`);

ffmpeg(inputFile)
.toFormat(format)
.on("error", (err) => reject(err))
.on("end", () => {
logger.info(`Converted file: ${outputFile}`);

fs.unlinkSync(inputFile); // cleanup temp file
resolve(outputFile);
})
.save(outputFile);
});
}