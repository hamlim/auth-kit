import { generateState } from "arctic";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createGitHubClient } from "./internal/github";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
    }
  }
}

export async function signin(_req: NextRequest): Promise<Response> {
  let github = createGitHubClient(
    process.env.GITHUB_CLIENT_ID,
    process.env.GITHUB_CLIENT_SECRET,
  );
  let state = generateState();

  let scopes = ["user:email"];

  let url = github.createAuthorizationURL(state, scopes);

  let res = new NextResponse(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
  res.cookies.set("state", state, {
    path: "/",
    httpOnly: true,
    maxAge: 600,
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
