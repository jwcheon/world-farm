import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../utils/supabaseClient";

export async function POST(req: NextRequest) {
  const uuid = crypto.randomUUID().replace(/-/g, "");

  cookies().set({
    name: "payment-nonce",
    value: uuid,
    httpOnly: true,
  });


  const cookieStore = cookies();
  const sid = cookieStore.get("sid")?.value;
  if (sid) {
    const { data, error } = await supabase
      .from("sessions")
      .select()
      .eq("id", sid)
      .maybeSingle();

    if (error) return NextResponse.json({ id: null });

    if (data?.userId) {
      const { error } = await supabase
        .from("payments")
        .insert({
          userId: data.userId,
          nonce: uuid,
        });

      if (error) return NextResponse.json({ id: null });
    }
  } else return NextResponse.json({ id: null });

  console.log(uuid);

  return NextResponse.json({ id: uuid });
}
