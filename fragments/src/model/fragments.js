// src/model/fragments.js

const crypto = require('crypto');
const db = require('./data');

class Fragment {
  constructor({ ownerId, type, size = 0 }) {
    this.id = crypto.randomUUID();
    this.ownerId = crypto.createHash('sha256').update(ownerId).digest('hex');
    this.type = type;
    this.size = size;
    this.created = new Date().toISOString();
    this.updated = new Date().toISOString();
  }

  static expand(f) {
    return {
      id: f.id,
      ownerId: f.ownerId,
      type: f.type,
      size: f.size,
      created: f.created,
      updated: f.updated,
    };
  }

  save() {
    db.writeFragment(this.ownerId, this);
  }

  async setData(buffer) {
    this.size = buffer.length;
    this.updated = new Date().toISOString();

    // Write the raw data to storage (memory or S3)
    await db.writeFragmentData(this.ownerId, this.id, buffer);

    // Update metadata
    db.updateFragment(this.ownerId, this);
  }

  async getData() {
    return db.readFragmentData(this.ownerId, this.id);
  }

  static async byId(ownerId, id) {
    const hashed = crypto.createHash('sha256').update(ownerId).digest('hex');
    return db.readFragment(hashed, id);
  }

  static async byUser(ownerId) {
    const hashed = crypto.createHash('sha256').update(ownerId).digest('hex');
    return db.readFragments(hashed);
  }

  async delete() {
    await db.deleteFragment(this.ownerId, this.id);
    await db.deleteFragmentData(this.ownerId, this.id);
  }
}

module.exports = Fragment;
