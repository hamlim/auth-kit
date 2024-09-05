type Cookie = {
  name: string;
  value: string;
};

type CookieOptions = {
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "lax" | "strict" | "none" | "strict";
};

export type CookieStore = {
  get(name: string): Cookie | undefined;
  getAll(): Cookie[];
  set(name: string, value: string, options: CookieOptions): void;
  delete(name: string): void;
};

export class AuthCookies {
  cookieStore: CookieStore;
  constructor(cookieStore: CookieStore) {
    this.cookieStore = cookieStore;
  }

  static cookieNames = {
    accessToken: "access_token",
    refreshToken: "refresh_token",
    state: "state",
    codeVerifier: "code_verifier",
  } as const;

  get(
    name: (typeof AuthCookies.cookieNames)[keyof typeof AuthCookies.cookieNames],
  ) {
    return this.cookieStore.get(name);
  }

  getAll() {
    return this.cookieStore.getAll();
  }

  setAccessToken({ value, expiresAt }: { value: string; expiresAt: Date }) {
    this.cookieStore.set(AuthCookies.cookieNames.accessToken, value, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      path: "/",
      maxAge: expiresAt.getTime() - Date.now(),
    });
  }

  refreshTokenCookieOptions = {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 400, // 400 days - max allowed by most browsers
  };

  setRefreshToken({ value }: { value: string }) {
    this.cookieStore.set(
      AuthCookies.cookieNames.refreshToken,
      value,
      this.refreshTokenCookieOptions,
    );
  }

  shortTermCookieOptions = {
    maxAge: 60 * 10, // 10 minutes
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  };

  setState({ value }: { value: string }) {
    this.cookieStore.set(
      AuthCookies.cookieNames.state,
      value,
      this.shortTermCookieOptions,
    );
  }

  setCodeVerifier({ value }: { value: string }) {
    this.cookieStore.set(
      AuthCookies.cookieNames.codeVerifier,
      value,
      this.shortTermCookieOptions,
    );
  }

  deleteAll() {
    this.cookieStore.delete(AuthCookies.cookieNames.accessToken);
    this.cookieStore.delete(AuthCookies.cookieNames.refreshToken);
    this.cookieStore.delete(AuthCookies.cookieNames.state);
    this.cookieStore.delete(AuthCookies.cookieNames.codeVerifier);
  }
}
