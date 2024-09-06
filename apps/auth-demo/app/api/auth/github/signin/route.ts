import { signin } from "auth-kit/signin";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return await signin(req);
}
