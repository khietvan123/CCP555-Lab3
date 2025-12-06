/* eslint-disable no-unused-vars */
// src/model/data/aws/index.js

/**
 * AWS BACKEND — stores metadata in DynamoDB, raw fragment data in S3
 */

const s3Client = require('./s3Client');
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');

const ddbDocClient = require('./ddbDocClient');
const {
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');

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
   METADATA STORAGE (DYNAMODB)
   ========================================================================== */

// Writes a fragment to DynamoDB. Returns a Promise.
async function writeFragment(ownerId, fragment) {
  const item = {
    ownerId,
    id: fragment.id,
    type: fragment.type,
    size: fragment.size,
    created: fragment.created,
    updated: fragment.updated,
  };

  const params = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    Item: item,
  };

  const command = new PutCommand(params);

  try {
    return await ddbDocClient.send(command);
  } catch (err) {
    logger.warn({ err, params, fragment }, 'error writing fragment to DynamoDB');
    throw err;
  }
}

// Return all fragments for a user
async function readFragments(ownerId) {
  const params = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    KeyConditionExpression: 'ownerId = :ownerId',
    ExpressionAttributeValues: {
      ':ownerId': ownerId,
    },
  };

  const command = new QueryCommand(params);

  try {
    const data = await ddbDocClient.send(command);
    return data?.Items || [];
  } catch (err) {
    logger.error({ err, params }, 'error getting fragments from DynamoDB');
    throw err;
  }
}

// Return one fragment by ID
async function readFragment(ownerId, id) {
  const params = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    Key: { ownerId, id },
  };

  const command = new GetCommand(params);

  try {
    const data = await ddbDocClient.send(command);
    return data?.Item;
  } catch (err) {
    logger.warn({ err, params }, 'error reading fragment from DynamoDB');
    throw err;
  }
}

// Delete fragment metadata only
async function deleteFragment(ownerId, id) {
  const params = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    Key: { ownerId, id },
  };

  const command = new DeleteCommand(params);

  try {
    return ddbDocClient.send(command);
  } catch (err) {
    logger.warn({ err, params }, 'error deleting fragment from DynamoDB');
    throw err;
  }
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
