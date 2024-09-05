import { GitHub } from "arctic";

export function createGitHubClient(clientId: string, clientSecret: string) {
  // @TODO: Handle preview login too
  let redirectURL = "https://auth-kit-iota.vercel.app/api/auth/github/callback";
  if (process.env.NODE_ENV === "development") {
    redirectURL = "http://localhost:3000/api/auth/github/callback";
  }

  return new GitHub(clientId, clientSecret, redirectURL);
}
