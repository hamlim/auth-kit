import { refresh } from "auth-kit/refresh";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return await refresh(req);
}
