import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../utils/supabaseClient";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const sid = cookieStore.get("sid")?.value;
  if (sid) {
    const { data: session, error } = await supabase
      .from("sessions")
      .select()
      .eq("id", sid)
      .maybeSingle();

    console.log("session", session)

    if (session?.userId) {
      const { data, error } = await supabase
        .from("users")
        .select("points")
        .eq("uuid", session.userId)
        .maybeSingle();

      console.log("points", data, error)

      if (error) return NextResponse.json({ points: "-" });
      return NextResponse.json({ points: data?.points || "-" });
    }
    else return NextResponse.json({ points: "-" });
  }
}

