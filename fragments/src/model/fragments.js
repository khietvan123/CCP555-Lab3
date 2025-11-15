const crypto = require('crypto');
const db = require('../data');

class Fragments {
  constructor({ ownerId, type, size = 0 }) {
    this.id = crypto.randomUUID();
    this.ownerId = ownerId;
    this.type = type;
    this.size = size;
    this.created = new Date().toISOString();
    this.updated = new Date().toISOString();
  }

  save() {
    db.writeFragment(this.ownerId, this);
  }

  setData(buffer) {
    this.size = buffer.length;
    this.updated = new Date().toISOString();
    db.writeFragmentData(this.id, buffer);
  }

  getData() {
    return db.readFragmentData(this.id);
  }

  static byUser(ownerId) {
    return db.readFragments(ownerId);
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
}

module.exports = Fragments;
