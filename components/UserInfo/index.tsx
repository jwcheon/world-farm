"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export const SignIn = () => {
  const { data: session } = useSession();
  if (session) {
    console.log("session", session)
    return (
      <>
        Signed in as {session?.user?.name?.slice(0, 10)}
      </>
    );
  } else {
    return <></>;
  }
};
