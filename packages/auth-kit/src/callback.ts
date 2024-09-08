import { ArcticFetchError, OAuth2RequestError } from "arctic";
import { type NextRequest, NextResponse } from "next/server";
import { AuthCookies, type CookieStore } from "./internal/auth-cookies";
import { createGitHubClient } from "./internal/github";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
    }
  }
}

export async function callback(request: NextRequest) {
  let url = new URL(request.url, "http://n");
  let code = url.searchParams.get("code");
  let state = url.searchParams.get("state");

  let authCookies = new AuthCookies(request.cookies as unknown as CookieStore);

  let storedState = authCookies.get(AuthCookies.cookieNames.state)?.value;

  if (code === null || storedState === null || state !== storedState) {
    // 400
    return new Response("Invalid request", { status: 400 });
  }

  let github = createGitHubClient(
    process.env.GITHUB_CLIENT_ID,
    process.env.GITHUB_CLIENT_SECRET,
  );

  try {
    let tokens = await github.validateAuthorizationCode(code);
    let accessToken = tokens.accessToken();
    // let accessTokenExpiresAt = tokens.accessTokenExpiresAt();

    authCookies.setAccessToken({
      value: accessToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    const res = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const user = await res.json();

    console.log(user);

    return NextResponse.redirect(new URL("/", url));
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      // Invalid authorization code, credentials, or redirect URI
      let code = e.code;
      console.error(e);
      return new Response("Invalid request", { status: 400 });
    }
    if (e instanceof ArcticFetchError) {
      // Failed to call `fetch()`
      let cause = e.cause;
      console.error(e);
      return new Response("Internal server error", { status: 500 });
    }
    // Parse error
    console.error(e);
    return new Response("Internal server error", { status: 500 });
  }
}
