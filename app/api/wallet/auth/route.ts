import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../utils/supabaseClient";
import { MiniAppWalletAuthSuccessPayload, verifySiweMessage } from "@worldcoin/minikit-js";
import { cookies } from 'next/headers'

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload
  nonce: string
}

export async function POST(req: NextRequest) {
  const { payload, nonce } = (await req.json()) as IRequestPayload;

  console.log({ payload, nonce });

  if (nonce != cookies().get('siwe')?.value) {
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
    const sessionId = req.cookies.get("sid")?.value;
    if (sessionId) {
      await supabase.from("sessions").update({ userId: user.id }).eq("id", sessionId);
    }

    //return NextResponse.json({ message: "Authenticated", user });

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
