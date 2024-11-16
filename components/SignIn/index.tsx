"use client";
import { useUserInfoQuery } from "@/app/api";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export const SignIn = () => {
  const { data: session } = useSession();
  const { data: userInfo, error, isLoading, refetch } = useUserInfoQuery();

  console.log({ userInfo, isLoading });

  useEffect(() => {
    refetch();
  }, [session, refetch]);

  if (session) {
    return (
      <>
        Signed in as {session?.user?.name?.slice(0, 10)} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  } else {
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    );
  }
};
