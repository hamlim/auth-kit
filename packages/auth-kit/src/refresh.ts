import { ArcticFetchError, OAuth2RequestError } from "arctic";
import type { NextRequest } from "next/server";
import { AuthCookies, type CookieStore } from "./internal/auth-cookies";
import { createGitHubClient } from "./internal/github";

export async function refresh(req: NextRequest) {
  let authCookies = new AuthCookies(req.cookies as unknown as CookieStore);

  let github = createGitHubClient(
    process.env.GITHUB_CLIENT_ID,
    process.env.GITHUB_CLIENT_SECRET,
  );

  let accessToken = authCookies.get(AuthCookies.cookieNames.accessToken)?.value;

  if (!accessToken) {
    throw new Error("Access token not found");
  }

  try {
    let tokens = await github.refreshAccessToken(accessToken);
    let newAccessToken = tokens.accessToken();
    let accessTokenExpiresAt = tokens.accessTokenExpiresAt();
    let refreshToken = tokens.refreshToken();

    authCookies.setAccessToken({
      value: newAccessToken,
      expiresAt: accessTokenExpiresAt,
    });
    authCookies.setRefreshToken({ value: refreshToken });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      // Invalid authorization code, credentials, or redirect URI
    }
    if (e instanceof ArcticFetchError) {
      // Failed to call `fetch()`
    }
    // Parse error
  }
}
