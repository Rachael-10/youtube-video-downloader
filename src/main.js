import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { fetchVideo } from "./downloader/youtube_fetcher.js";
import { convertVideo } from "./downloader/converter.js";
import { uploadToCloud } from "./downloader/cloud_uploader.js";
import { validateInput } from "./utils/validation.js";
import { logger } from "./utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
try {
const inputPath = path.join(__dirname, "../data/input.sample.json");
const raw = fs.readFileSync(inputPath, "utf-8");
const jobs = JSON.parse(raw);

validateInput(jobs);

for (const job of jobs) {
logger.info(`Starting job for URL: ${job.url}`);

const tempFile = await fetchVideo(job.url, job.quality);
const converted = await convertVideo(tempFile, job.format, job.fileName);
const cloudPath = await uploadToCloud(job.storageProvider, converted, job.storagePath);

logger.info(`Completed job → Uploaded to: ${cloudPath}`);
}
} catch (err) {
logger.error(`Fatal error: ${err.message}`);
process.exit(1);
}
}

main();