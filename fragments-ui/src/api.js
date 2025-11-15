const apiUrl = process.env.API_URL || 'http://localhost:8080';

export async function getUserFragments(user) {
  const url = new URL('/v1/fragments', apiUrl);
  const res = await fetch(url, { headers: user.authorizationHeaders() });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function createFragment(user, type, content) {
  return fetch(`${process.env.API_URL}/v1/fragments`, {
    method: "POST",
    headers: user.authorizationHeaders(type),
    body: type === "application/json" ? JSON.stringify(JSON.parse(content)) : content
  }).then(r => r.json());
}

