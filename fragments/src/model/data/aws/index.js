// src/model/data/aws/index.js

const MemoryDB = require('../memory/memory-db');
const metadataDB = new MemoryDB();

const s3Client = require('./s3Client');
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} = require('@aws-sdk/client-s3');

const logger = require('../../../logger');

// Convert stream → Buffer
const streamToBuffer = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });

// WRITE to S3
async function writeFragmentData(ownerId, id, data) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
    Body: data,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
  } catch (err) {
    logger.error({ err }, 'error writing to S3');
    throw new Error('unable to upload fragment data');
  }
}

// READ from S3
async function readFragmentData(ownerId, id) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
  };

  try {
    const res = await s3Client.send(new GetObjectCommand(params));
    return streamToBuffer(res.Body);
  } catch (err) {
    logger.error({ err }, 'error reading from S3');
    throw new Error('unable to read fragment data');
  }
}

// DELETE from S3
async function deleteFragmentData(ownerId, id) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
  } catch (err) {
    logger.error({ err }, 'error deleting from S3');
    throw new Error('unable to delete fragment data');
  }
}

module.exports = {
  ...metadataDB,
  writeFragmentData,
  readFragmentData,
  deleteFragmentData,
};
