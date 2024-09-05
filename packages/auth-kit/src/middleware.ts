import { type NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  let res = NextResponse.next();
  return res;
}
