import { expect, test } from "bun:test";
import type { NextRequest } from "next/server";
import signin from "../signin";

test("signin", async () => {
  process.env.GITHUB_CLIENT_ID = "test-client-id";
  process.env.GITHUB_CLIENT_SECRET = "test-client-secret";
  let req = new Request("http://localhost:3000/api/auth/signin");
  let res = await signin(req as unknown as NextRequest);

  expect(res.status).toBe(302);
  expect(res.headers.get("Location")).toInclude(
    "https://github.com/login/oauth/authorize",
  );
});
