import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../utils/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

export const sessionMiddleware = async (req: NextRequest) => {
  const cookieStore = cookies();
  let sid = cookieStore.get("sid")?.value;
  if (!sid) {
    sid = uuidv4();
    cookies().set("sid", sid, { secure: true });
  }

  console.log("sid sessionMiddleware", sid)

  const { data: session, error } = await supabase
    .from("sessions")
    .upsert({ id: sid }, { onConflict: "id" })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  // if (!cookieStore.get("sid")?.value) {
  //   const response = NextResponse.next();
  //   response.cookies.set("sid", sid, { httpOnly: true, maxAge: 86400 * 7 });
  //   return response;
  // }

  return session;
};
