// src/model/data/memory/index.js
// In-memory database for fragments

const memory = {
  fragments: {},
  data: {},
};

// ----- METADATA FUNCTIONS -----

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

function updateFragment(ownerId, updated) {
  const frags = memory.fragments[ownerId] || [];
  const index = frags.findIndex(f => f.id === updated.id);
  if (index !== -1) frags[index] = updated;
}

// ----- DATA FUNCTIONS -----

function writeFragmentData(ownerId, fragmentId, buffer) {
  if (!memory.data[ownerId]) memory.data[ownerId] = {};
  memory.data[ownerId][fragmentId] = buffer;
}

function readFragmentData(ownerId, fragmentId) {
  return memory.data[ownerId]?.[fragmentId] || null;
}

function deleteFragment(ownerId, fragmentId) {
  if (memory.fragments[ownerId]) {
    memory.fragments[ownerId] = memory.fragments[ownerId].filter(
      f => f.id !== fragmentId
    );
  }
  if (memory.data[ownerId]) {
    delete memory.data[ownerId][fragmentId];
  }
}

module.exports = {
  writeFragment,
  readFragments,
  readFragment,
  updateFragment,
  writeFragmentData,
  readFragmentData,
  deleteFragment,
};
