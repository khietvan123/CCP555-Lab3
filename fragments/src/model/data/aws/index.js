/* eslint-disable no-unused-vars */
// src/model/data/aws/index.js

/**
 * AWS BACKEND — stores metadata in memory, raw fragment data in S3
 */

const MemoryDB = require('../memory/memory-db');
const metadataDB = new MemoryDB();

const s3Client = require('./s3Client');
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} = require('@aws-sdk/client-s3');

const logger = require('../../../logger');

/**
 * Convert S3 ReadableStream -> Buffer
 */
function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

/* ============================================================================
   METADATA STORAGE (IN MEMORY)
   Lab expects these to exist when AWS backend is active.
   ========================================================================== */

/**
 * Save metadata for a fragment
 */
function writeFragment(ownerId, fragment) {
  return metadataDB.writeFragment(ownerId, fragment);
}

/**
 * Return all fragments for a user
 */
function readFragments(ownerId) {
  return metadataDB.readFragments(ownerId);
}

/**
 * Return one fragment by ID
 */
function readFragment(ownerId, id) {
  const list = metadataDB.readFragments(ownerId);
  return list.find((f) => f.id === id);
}

/**
 * Delete fragment metadata only
 */
function deleteFragment(ownerId, id) {
  const list = metadataDB.readFragments(ownerId);
  const index = list.findIndex((f) => f.id === id);
  if (index >= 0) list.splice(index, 1);
}

/* ============================================================================
   S3 OBJECT STORAGE (ACTUAL BINARY/TEXT DATA)
   ========================================================================== */

async function writeFragmentData(ownerId, id, data) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/fragments/data/${id}`,
    Body: data,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
  } catch (err) {
    logger.error({ err }, 'error writing to S3');
    throw new Error('unable to upload fragment data');
  }
}

async function readFragmentData(ownerId, id) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/fragments/data/${id}`,
  };

  try {
    const res = await s3Client.send(new GetObjectCommand(params));
    return streamToBuffer(res.Body);
  } catch (err) {
    // IMPORTANT: integration tests expect null instead of throwing
    return null;
  }
}

async function deleteFragmentData(ownerId, id) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/fragments/data/${id}`,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
  } catch (err) {
    // S3 delete should be silent
    logger.error({ err }, 'error deleting S3 data');
  }
}

/* ============================================================================
   EXPORT
   ========================================================================== */

module.exports = {
  // metadata
  writeFragment,
  readFragment,
  readFragments,
  deleteFragment,

  // S3 data
  writeFragmentData,
  readFragmentData,
  deleteFragmentData,
};
