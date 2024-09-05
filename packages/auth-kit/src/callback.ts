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
    throw new Error("Invalid request");
  }

  let github = createGitHubClient(
    process.env.GITHUB_CLIENT_ID,
    process.env.GITHUB_CLIENT_SECRET,
  );

  try {
    let tokens = await github.validateAuthorizationCode(code);
    let accessToken = tokens.accessToken();
    let accessTokenExpiresAt = tokens.accessTokenExpiresAt();

    authCookies.setAccessToken({
      value: accessToken,
      expiresAt: accessTokenExpiresAt,
    });

    return NextResponse.redirect("/");
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      // Invalid authorization code, credentials, or redirect URI
      let code = e.code;
    }
    if (e instanceof ArcticFetchError) {
      // Failed to call `fetch()`
      let cause = e.cause;
      // ...
    }
    // Parse error
  }
}
