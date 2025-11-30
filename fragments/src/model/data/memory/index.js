// src/model/data/memory/index.js
// In-memory storage for fragments + data

const memory = {
  fragments: {},      // { ownerId: [fragment metadata] }
  data: {}            // { ownerId: { fragmentId: Buffer } }
};

// ---- Metadata ----
function writeFragment(ownerId, fragment) {
  if (!memory.fragments[ownerId]) {
    memory.fragments[ownerId] = [];
  }
  memory.fragments[ownerId].push(fragment);
}

function readFragments(ownerId) {
  return memory.fragments[ownerId] || [];
}

function readFragment(ownerId, fragmentId) {
  const frags = memory.fragments[ownerId] || [];
  return frags.find(f => f.id === fragmentId);
}

function updateFragment(ownerId, fragment) {
  const frags = memory.fragments[ownerId] || [];
  const idx = frags.findIndex(f => f.id === fragment.id);
  if (idx !== -1) frags[idx] = fragment;
}

function deleteFragment(ownerId, fragmentId) {
  if (!memory.fragments[ownerId]) return;
  memory.fragments[ownerId] = memory.fragments[ownerId].filter(f => f.id !== fragmentId);
}

// ---- Data ----
function writeFragmentData(ownerId, fragmentId, buffer) {
  if (!memory.data[ownerId]) {
    memory.data[ownerId] = {};
  }
  memory.data[ownerId][fragmentId] = buffer;
}

function readFragmentData(ownerId, fragmentId) {
  return memory.data[ownerId]?.[fragmentId];
}

function deleteFragmentData(ownerId, fragmentId) {
  if (memory.data[ownerId]) {
    delete memory.data[ownerId][fragmentId];
  }
}

module.exports = {
  writeFragment,
  readFragments,
  readFragment,
  updateFragment,
  deleteFragment,
  writeFragmentData,
  readFragmentData,
  deleteFragmentData,
};
