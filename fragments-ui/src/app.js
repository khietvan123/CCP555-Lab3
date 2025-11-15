// src/app.js
import { signIn, signOut, getUser } from './auth.js';
import { getUserFragments, createFragment } from './api.js';

// MAIN UI INITIALIZATION
async function init() {
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');

  // Default state (not signed in)
  userSection.hidden = true;
  loginBtn.hidden = false;
  loginBtn.onclick = () => signIn();

  // Check login status
  const user = await getUser();
  if (!user) return;

  // Signed in → update UI
  userSection.hidden = false;
  loginBtn.hidden = true;
  console.log("ID TOKEN:", user.idToken);
  userSection.innerHTML = `
    <p>Welcome, ${user.username}!</p>
    <button id="logout">Logout</button>

    <section id="create-section">
      <h3>Create Fragment</h3>

      <select id="fragment-type">
        <option value="text/plain">Plain Text</option>
        <option value="text/markdown">Markdown</option>
        <option value="application/json">JSON</option>
      </select>

      <textarea id="fragment-content" rows="6" cols="50"></textarea>

      <button id="create-btn">Create Fragment</button>
    </section>

    <section id="list-section">
      <h3>Your Fragments</h3>
      <ul id="fragment-list"></ul>
    </section>
  `;

  // Logout button handler
  document.querySelector('#logout').onclick = async () => {
    await signOut();
  };

  // Create fragment handler
  document.querySelector('#create-btn').onclick = async () => {
    const type = document.querySelector('#fragment-type').value;
    const content = document.querySelector('#fragment-content').value;

    if (!content.trim()) {
      alert("Content cannot be empty.");
      return;
    }

    try {
      const result = await createFragment(user, type, content);
      alert("Fragment created successfully!");
      await loadFragments(user);
    } catch (err) {
      console.error("Failed to create fragment:", err);
      alert("Error creating fragment.");
    }
  };

  // Load fragments on page load
  await loadFragments(user);
}

// Load and display fragments
async function loadFragments(user) {
  try {
    const data = await getUserFragments(user);
    console.log("User fragments:", data);

    const list = document.querySelector("#fragment-list");
    list.innerHTML = "";

    data.fragments.forEach((id) => {
      const li = document.createElement("li");
      li.textContent = id;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load fragments:", err);
  }
}

// Start UI
document.addEventListener('DOMContentLoaded', init);
