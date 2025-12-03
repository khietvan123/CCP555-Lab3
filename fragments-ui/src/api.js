const apiUrl = process.env.API_URL || "http://localhost:8080";
const BASIC = "Basic " + btoa("admin:password"); // change if your lab uses different creds

export async function getUserFragments() {
  const url = new URL("/v1/fragments", apiUrl);
  const res = await fetch(url, { headers: { Authorization: BASIC }});
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function createFragment(type, content) {
  const url = new URL("/v1/fragments", apiUrl);

  const body =
    type === "application/json"
      ? JSON.stringify(JSON.parse(content))
      : content;
  console.log("TYPE IS:", type, "typeof:", typeof type);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: BASIC,
      "Content-Type": type,
    },
    body,
  });

  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}
