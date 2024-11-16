"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const fetchUserInfo = async (): Promise<any> => {
  const response = await fetch("/api/userinfo");

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch user info");
  }

  return response.json();
};

export const useUserInfoQuery = (
  options?: UseQueryOptions<any, Error, any>
) => {
  return useQuery({
    queryKey: ["userinfo"],
    queryFn: fetchUserInfo,
    enabled: false,
    ...options,
  });
};

export const fetchNonce = async (): Promise<{ nonce: string }> => {
  const response = await fetch("/api/wallet/nonce");

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch nonce");
  }

  return response.json();
};

export const useNonceQuery = (
  options?: UseQueryOptions<{ nonce: string }, Error, { nonce: string }>
) => {
  return useQuery({
    queryKey: ["walletNonce"],
    queryFn: fetchNonce,
    ...options,
  });
};

export const fetchUsername = async (address: string | null): Promise<
  {
    username: string;
    address: string;
    profile_picture_url: string;
  }[]> => {
  const response = await fetch("https://usernames.worldcoin.org/api/v1/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      addresses: [address],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch nonce");
  }

  return response.json();
};

export const useUsername = (
  address: string | null,
  options?: UseQueryOptions<
    {
      username: string;
      address: string;
      profile_picture_url: string;
    }[],
    Error
  >
) => {
  return useQuery<
    {
      username: string;
      address: string;
      profile_picture_url: string;
    }[],
    Error
  >({
    queryKey: ["username", address],
    queryFn: () => fetchUsername(address),
    enabled: !!address,
    ...options,
  });
};