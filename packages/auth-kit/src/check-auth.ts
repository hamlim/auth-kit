import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { AuthCookies, type CookieStore } from "./internal/auth-cookies";

export function checkAuth() {
  let authCookies = new AuthCookies(cookies());
  let token = authCookies.get(AuthCookies.cookieNames.accessToken);
  return token;
}

export function checkMiddlewareAuth(req: NextRequest) {
  let authCookies = new AuthCookies(req.cookies as unknown as CookieStore);
  let token = authCookies.get(AuthCookies.cookieNames.accessToken);
  return token;
}
