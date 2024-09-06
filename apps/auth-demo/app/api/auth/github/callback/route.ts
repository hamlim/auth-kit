import { callback } from "auth-kit/callback";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return await callback(req);
}
