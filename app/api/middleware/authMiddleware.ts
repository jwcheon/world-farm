import { sessionMiddleware } from "./sessionMiddleware";
import { supabase } from "../utils/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export const authMiddleware = async (
  req: NextRequest,
  handler: (user: any, session: any) => Promise<NextResponse>
) => {
  const session = await sessionMiddleware(req);

  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.userId)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return handler(user, session);
};
