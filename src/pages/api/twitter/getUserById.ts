import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../../env";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Extract sessionData from the request body
  const { sessionData } = req.body;

  if (!sessionData || !sessionData.user) {
    return res
      .status(401)
      .json({ error: "You must be logged in to access this endpoint" });
  }

  try {
    const userId = sessionData?.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID not found in session" });
    }

    // Check if we already have the Twitter ID in the session
    let twitterUserId = sessionData.user?.twitterId;
    console.log("Twitter User ID:", twitterUserId);

    // Prepare the fetch to Twitter API
    const twitterApiUrl = `https://api.x.com/2/users/${twitterUserId}`;

    console.log("Twitter API URL:", twitterApiUrl);

    // We need to get a Twitter API bearer token - this should be set in your environment variables
    const bearerToken = env.TWITTER_BEARER_TOKEN;

    if (!bearerToken) {
      return res
        .status(500)
        .json({ error: "Twitter API bearer token not configured" });
    }

    // Make the request to Twitter API
    const response = await fetch(twitterApiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Response status:", response.status);
    console.log("Response status text:", response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error(
        "Twitter API error response:",
        JSON.stringify(errorData, null, 2),
      );
      return res.status(response.status).json({
        error: `Twitter API error: ${response.statusText}`,
        details: errorData,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch tweets from Twitter API" });
  }
}
