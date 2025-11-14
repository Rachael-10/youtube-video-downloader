import AWS from "aws-sdk";
import azure from "azure-storage";
import { Storage } from "@google-cloud/storage";
import fs from "fs";
import path from "path";
import { logger } from "../utils/logger.js";

export async function uploadToCloud(provider, filePath, remotePath) {
switch (provider.toLowerCase()) {
case "aws s3":
return uploadAWS(filePath, remotePath);
case "azure":
return uploadAzure(filePath, remotePath);
case "google cloud":
return uploadGCP(filePath, remotePath);
default:
throw new Error(`Unknown provider: ${provider}`);
}
}

async function uploadAWS(localFile, remotePath) {
const s3 = new AWS.S3();
const Bucket = process.env.AWS_BUCKET || "my-bucket";

const Key = remotePath;
const Body = fs.readFileSync(localFile);

await s3.upload({ Bucket, Key, Body }).promise();

logger.info(`Uploaded to AWS S3: s3://${Bucket}/${Key}`);
return `s3://${Bucket}/${Key}`;
}

async function uploadAzure(localFile, remotePath) {
const blobService = azure.createBlobService();
const container = process.env.AZURE_CONTAINER || "videos";
const blob = path.basename(remotePath);

return new Promise((resolve, reject) => {
blobService.createBlockBlobFromLocalFile(
container,
blob,
localFile,
(err) => {
if (err) return reject(err);
const url = `azure://${container}/${blob}`;
logger.info(`Uploaded to Azure: ${url}`);
resolve(url);
}
);
});
}

async function uploadGCP(localFile, remotePath) {
const storage = new Storage();
const bucketName = process.env.GCP_BUCKET || "my-gcp-bucket";

await storage.bucket(bucketName).upload(localFile, {
destination: remotePath,
});

const url = `gs://${bucketName}/${remotePath}`;
logger.info(`Uploaded to Google Cloud: ${url}`);
return url;
}