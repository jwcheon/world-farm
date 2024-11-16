import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../utils/supabaseClient";
import { MiniAppWalletAuthSuccessPayload, verifySiweMessage } from "@worldcoin/minikit-js";
import { cookies } from 'next/headers'
import { sessionMiddleware } from "../../middleware/sessionMiddleware";

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload
  nonce: string
}

export async function POST(req: NextRequest) {
  const { payload, nonce } = (await req.json()) as IRequestPayload;
  await sessionMiddleware(req);

  console.log("1", payload);
  console.log("2", nonce);

  const storedNonce = cookies().get('siwe')?.value;
  console.log("storedNonce", storedNonce)

  if (nonce !== storedNonce) {
    console.log("!!invalid nonce")
    return NextResponse.json({
      status: 'error',
      isValid: false,
      message: 'Invalid nonce',
    })
  }

  try {
    const validMessage = await verifySiweMessage(payload, nonce);
    console.log("validMessage", validMessage);

    if (!validMessage) {
      return NextResponse.json({
        status: 'error',
        isValid: false,
        message: "SIWE verify failed",
      });
    }

    // check if user exists, if not let's create a new one
    const { data: user, error } = await supabase
      .from("users")
      .upsert({ walletAddress: payload.address }, { onConflict: "walletAddress" })
      .select("*")
      .single();

    console.log("user", user);

    if (error) {
      return NextResponse.json({
        status: 'error',
        isValid: false,
        message: error.message,
      })
    }

    // update session with userId
    const cookieStore = cookies();
    const sid = cookieStore.get("sid")?.value;

    console.log("sid", sid);
    if (sid) {
      await supabase.from("sessions").update({ userId: user.uuid }).eq("id", sid);
    }

    return NextResponse.json({
      status: 'success',
      isValid: validMessage.isValid,
    })
  } catch (error: any) {
    // Handle errors in validation or processing
    return NextResponse.json({
      status: 'error',
      isValid: false,
      message: error.message,
    })
  }
}
