import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  console.log("~~~~~~")
  const session = await getServerSession(authOptions);

  console.log("!!!session", session)

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const response = await fetch("https://id.worldcoin.org/userinfo", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userInfo = await response.json();
    return NextResponse.json(userInfo, { status: 200 });
  } catch (error) {
    console.error("Error fetching user info:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
