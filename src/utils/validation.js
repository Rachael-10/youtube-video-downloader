import { logger } from "./logger.js";

export function validateInput(jobs) {
if (!Array.isArray(jobs)) throw new Error("Input must be an array of jobs");

for (const job of jobs) {
const required = ["url", "fileName", "format", "quality", "storageProvider", "storagePath"];
for (const key of required) {
if (!job[key]) throw new Error(`Missing required field: ${key}`);
}
}

logger.info("Input validation passed.");
}