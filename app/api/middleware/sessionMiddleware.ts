import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../utils/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export const sessionMiddleware = async (req: NextRequest) => {
  let sid = req.cookies.get("sid")?.value || uuidv4();

  const { data: session, error } = await supabase
    .from("sessions")
    .upsert({ id: sid }, { onConflict: "id" })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  if (!req.cookies.get("sid")) {
    const response = NextResponse.next();
    response.cookies.set("sid", sid, { httpOnly: true, maxAge: 86400 * 7 });
    return response;
  }

  return session;
};
