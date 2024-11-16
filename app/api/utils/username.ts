export const fetchUsernameBe = async (address: string | null): Promise<
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
    throw new Error(errorData.error || "Failed to fetch username");
  }

  return response.json();
};