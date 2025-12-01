const request = require('supertest');
const app = require('../../src/app');

describe("POST /v1/fragments", () => {
  test("denies unauthenticated users", async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .send("Hello world");

    expect(res.status).toBe(401);
  });

  test("authenticated user can create text/plain fragment", async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send("Hello World");

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("ok");
    expect(res.body.fragment.type).toBe("text/plain");
  });

  test("rejects unsupported content type", async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/pdf')
      .send(JSON.stringify({ a: 1 }));

    expect(res.status).toBe(415);
  });
});
