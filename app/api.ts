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