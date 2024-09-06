import { type NextRequest, NextResponse } from "next/server";
import { AuthCookies, type CookieStore } from "./internal/auth-cookies";
import { parseJwt } from "./internal/parse-jwt";
import { refreshTokens } from "./refresh";

export default function createMiddleware({
  getIsProtectedRoute,
}: { getIsProtectedRoute: (req: NextRequest) => Promise<boolean> }) {
  return async function middleware(req: NextRequest) {
    let authCookies = new AuthCookies(req.cookies as unknown as CookieStore);

    let accessToken = authCookies.get(
      AuthCookies.cookieNames.accessToken,
    )?.value;

    let isProtectedRoute = await getIsProtectedRoute(req);

    if (!accessToken && isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", req.url) as URL);
    }
    if (!accessToken) {
      return NextResponse.next();
    }
    let jwt = parseJwt(accessToken);
    let expiresAt = jwt.exp;
    let now = Math.floor(Date.now() / 1000);
    // expires within 5 minutes
    let isExpiringSoon = expiresAt - now < 5 * 60;

    if (isExpiringSoon) {
      let tokens = await refreshTokens(req);
      if (tokens instanceof Error) {
        authCookies.deleteAll();
        return NextResponse.next();
      }
      authCookies.setAccessToken({
        value: tokens.accessToken,
        expiresAt: tokens.accessTokenExpiresAt,
      });
      authCookies.setRefreshToken({ value: tokens.refreshToken });
      return NextResponse.next(req);
    }
    return NextResponse.next();
  };
}
