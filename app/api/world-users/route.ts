import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../utils/supabaseClient";

export async function GET(req: NextRequest) {
  const { data: users, error } = await supabase
    .from("users")
    .select("username, points")
    .order("points", { ascending: false })
    .limit(100);

  console.log("users", users)

  return NextResponse.json({ users });
}

