// src/model/data/memory/memory-db.js

class MemoryDB {
  constructor() {
    this.data = new Map();
    this.metadata = new Map();
  }

  /* ------------------------------
     RAW DATA STORAGE
  ------------------------------ */
  async writeFragmentData(ownerId, id, data) {
    this.data.set(`${ownerId}/${id}`, data);
  }

  async readFragmentData(ownerId, id) {
    const key = `${ownerId}/${id}`;
    if (!this.data.has(key)) return null;
    return this.data.get(key);
  }

  async deleteFragmentData(ownerId, id) {
    this.data.delete(`${ownerId}/${id}`);
  }

  /* ------------------------------
     METADATA STORAGE — REQUIRED API
  ------------------------------ */

  writeFragment(ownerId, fragment) {
    if (!this.metadata.has(ownerId)) {
      this.metadata.set(ownerId, []);
    }
    const list = this.metadata.get(ownerId);
    list.push(fragment);
    return fragment;
  }

  readFragments(ownerId) {
    return this.metadata.get(ownerId) || [];
  }

  readFragment(ownerId, id) {
    const list = this.readFragments(ownerId);
    return list.find((f) => f.id === id) || null;
  }

  deleteFragment(ownerId, id) {
    const list = this.readFragments(ownerId);
    const idx = list.findIndex((f) => f.id === id);
    if (idx >= 0) list.splice(idx, 1);
  }
}

module.exports = MemoryDB;
