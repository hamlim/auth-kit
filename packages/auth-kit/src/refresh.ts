import { ArcticFetchError, OAuth2RequestError } from "arctic";
import { type NextRequest, NextResponse } from "next/server";
import { AuthCookies, type CookieStore } from "./internal/auth-cookies";
import { createGitHubClient } from "./internal/github";

export async function refreshTokens(req: NextRequest) {
  let github = createGitHubClient(
    process.env.GITHUB_CLIENT_ID,
    process.env.GITHUB_CLIENT_SECRET,
  );

  let authCookies = new AuthCookies(req.cookies as unknown as CookieStore);

  let accessToken = authCookies.get(AuthCookies.cookieNames.accessToken)?.value;

  if (!accessToken) {
    throw new Error("Access token not found");
  }

  try {
    let tokens = await github.refreshAccessToken(accessToken);
    let newAccessToken = tokens.accessToken();
    let accessTokenExpiresAt = tokens.accessTokenExpiresAt();
    let refreshToken = tokens.refreshToken();

    return {
      accessToken: newAccessToken,
      accessTokenExpiresAt,
      refreshToken,
    };
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      // Invalid authorization code, credentials, or redirect URI
    }
    if (e instanceof ArcticFetchError) {
      // Failed to call `fetch()`
    }
    // Parse error
    return new Error("Failed to refresh tokens");
  }
}

export async function refresh(req: NextRequest) {
  let authCookies = new AuthCookies(req.cookies as unknown as CookieStore);

  let accessToken = authCookies.get(AuthCookies.cookieNames.accessToken)?.value;

  if (!accessToken) {
    throw new Error("Access token not found");
  }

  let tokens = await refreshTokens(req);

  if (tokens instanceof Error) {
    return NextResponse.redirect(new URL("/login", req.url) as URL);
  }

  authCookies.setAccessToken({
    value: tokens.accessToken,
    expiresAt: tokens.accessTokenExpiresAt,
  });
  authCookies.setRefreshToken({ value: tokens.refreshToken });

  return new Response(null, { status: 200 });
}
