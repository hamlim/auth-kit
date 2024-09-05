import {
  // You can pick any supported provider from here: https://arcticjs.dev/
  // We're using GitHub as our social login
  GitHub,
  generateState,
} from "arctic";
import { type NextRequest, NextResponse } from "next/server";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
    }
  }
}

export default async function signin(
  _req: NextRequest,
): Promise<NextResponse<unknown>> {
  // @TODO: Handle preview login too
  let redirectURL = "https://auth-kit-iota.vercel.app/api/auth/github/callback";
  if (process.env.NODE_ENV === "development") {
    redirectURL = "http://localhost:3000/api/auth/github/callback";
  }

  let github = new GitHub(
    process.env.GITHUB_CLIENT_ID,
    process.env.GITHUB_CLIENT_SECRET,
    redirectURL,
  );
  let state = generateState();

  let scopes = ["user:email"];

  let url = github.createAuthorizationURL(state, scopes);

  let res = NextResponse.next({
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
  res.cookies.set({
    name: "state",
    value: state,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 min
  });

  return res;
}
