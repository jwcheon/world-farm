import { NextRequest, NextResponse } from "next/server";
import { sessionMiddleware } from "../middleware/sessionMiddleware";

export async function GET(req: NextRequest) {
  const session = await sessionMiddleware(req);

  return NextResponse.json({
    message: "Session details",
    session,
  });
}
