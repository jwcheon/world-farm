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
    enabled: false, // Manual fetching
    ...options,
  });
};