# Auth Kit

This repo aims to showcase how to implement auth within a Next.js app ([auth-demo](./apps/auth-demo/)), using social login and cookies.

## Getting Started:

- Clone the repo
- run `bun i` to install dependencies
- run `bun run dev --filter=auth-demo...` to start the demo app

## About:

This repo/demo uses [Arctic v2](https://arcticjs.dev/) to handle the heavy lifting for the social login flows.

---

## Setup

This demo uses [Arctic v2]() (still a pre-release version, so some parts may change in the future), to implement the common components for OAuth within a web application:

- Logging in (signin and callback routes)
- Refreshing session
  - Both on the client and also as a pre-flight middleware
- Accessing session from the client and server

### Requirements:

This demo is using Next.js (app router), which uses React Server Components, Next.js Middleware, and React Context for client components consuming the session.

Additionally - this demo currently only supports GitHub as the social login flow (PRs are welcome for contributing other sign-in flows)!

Instructions for creating a new GitHub OAuth app are available [here](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)

You'll need to run through that flow twice, once for your production domain and another time for a local domain.