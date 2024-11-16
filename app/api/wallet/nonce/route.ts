// Docs: https://docs.world.org/mini-apps/commands/wallet-auth

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  // Expects only alphanumeric characters
  const nonce = crypto.randomUUID().replace(/-/g, "");

  // The nonce should be stored somewhere that is not tamperable by the client
  // Optionally you can HMAC the nonce with a secret key stored in your environment
  cookies().set("siwe", nonce, { secure: true });

  console.log("set nonce", nonce);
  return NextResponse.json({ nonce });
}

