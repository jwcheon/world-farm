import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../utils/supabaseClient";

export async function POST(req: NextRequest) {
  const { walletAddress, signedMessage } = await req.json();

  // TODO: validation logic from the docs go here

  // check if user exists, if not let's create a new one
  const { data: user, error } = await supabase
    .from("users")
    .upsert({ walletAddress }, { onConflict: "walletAddress" })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // update session with userId
  const sessionId = req.cookies.get("sid")?.value;
  if (sessionId) {
    await supabase.from("sessions").update({ userId: user.id }).eq("id", sessionId);
  }

  return NextResponse.json({ message: "Authenticated", user });
}
