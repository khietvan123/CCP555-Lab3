// src/model/data/memory/memory-db.js

class MemoryDB {
  constructor() {
    this.data = new Map();
    this.metadata = new Map();
  }

  async writeFragmentData(ownerId, id, data) {
    this.data.set(`${ownerId}/${id}`, data);
  }

  async readFragmentData(ownerId, id) {
    const key = `${ownerId}/${id}`;
    if (!this.data.has(key)) throw new Error('not found');
    return this.data.get(key);
  }

  async deleteFragmentData(ownerId, id) {
    this.data.delete(`${ownerId}/${id}`);
  }

  async writeFragmentMetadata(ownerId, fragment) {
    this.metadata.set(`${ownerId}/${fragment.id}`, fragment);
  }

  async readFragmentMetadata(ownerId, id) {
    return this.metadata.get(`${ownerId}/${id}`);
  }

  async deleteFragmentMetadata(ownerId, id) {
    this.metadata.delete(`${ownerId}/${id}`);
  }
}

module.exports = MemoryDB;
