// src/data/memory.js
// Simple in-memory database store for fragments

// src/data/memory.js

const memory = {
  fragments: {},
  data: {},
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

// ---- Data ----
function writeFragmentData(fragmentId, buffer) {
  memory.data[fragmentId] = buffer;
}

function readFragmentData(fragmentId) {
  return memory.data[fragmentId];
}

module.exports = {
  writeFragment,
  readFragments,
  writeFragmentData,
  readFragmentData,
};
