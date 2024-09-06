import { createMiddleware } from "auth-kit/middleware";
import type { NextRequest } from "next/server";

export default createMiddleware({
  getIsProtectedRoute: async (_req: NextRequest) => false,
});
