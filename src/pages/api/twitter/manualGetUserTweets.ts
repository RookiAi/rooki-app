import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../../env";

interface TwitterResponse {
  data: any[];
  meta?: {
    result_count: number;
    next_token?: string;
  };
  includes?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Extract userId from the request body
  const {
    userId,
    paginationToken,
    numberOfPages = 1,
    excludeReplies = false,
  } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ error: "Twitter user ID is required" });
  }

  console.log("Manual Twitter User ID:", userId);
  console.log("Pagination token:", paginationToken);
  console.log("Number of pages requested:", numberOfPages);

  try {
    // Prepare the fetch to Twitter API
    const twitterApiUrl = `https://api.x.com/2/users/${userId}/tweets`;

    // Add query parameters according to X API docs
    const queryParams = new URLSearchParams({
      max_results: "100",
      "tweet.fields": "created_at,text",
      expansions: "author_id,in_reply_to_user_id,referenced_tweets.id",
      "user.fields": "name,username,profile_image_url",
      ...(excludeReplies && { exclude: ["replies"] }),
    });

    // Add pagination token if available
    if (paginationToken) {
      queryParams.append("pagination_token", paginationToken);
    }

    const fullUrl = `${twitterApiUrl}?${queryParams}`;
    console.log("Twitter API URL:", fullUrl);

    // We need to get a Twitter API bearer token - this should be set in your environment variables
    const bearerToken = env.TWITTER_BEARER_TOKEN;

    if (!bearerToken) {
      return res
        .status(500)
        .json({ error: "Twitter API bearer token not configured" });
    }

    // Make the request to Twitter API
    const response = await fetch(fullUrl, {
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

    const data: TwitterResponse = await response.json();

    // If this is already a pagination request, just return the data
    if (paginationToken) {
      return res.status(200).json(data);
    }

    // If no pagination token was provided and numberOfPages > 1, fetch additional pages
    if (data.meta?.next_token && numberOfPages > 1) {
      // Store the results from all pages
      const allPagesData: TwitterResponse[] = [data];
      let currentToken: string | null | undefined = data.meta.next_token;
      let currentPage = 1;

      // Fetch additional pages
      while (currentToken && currentPage < numberOfPages) {
        try {
          // Prepare for next page request
          queryParams.set("pagination_token", currentToken);
          const nextPageUrl = `${twitterApiUrl}?${queryParams}`;

          console.log(
            `Fetching page ${currentPage + 1} with token:`,
            currentToken,
          );

          // Fetch the next page
          const nextPageResponse = await fetch(nextPageUrl, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
          });

          if (!nextPageResponse.ok) {
            console.error(`Failed to fetch page ${currentPage + 1} of tweets`);
            break; // Exit the loop if we fail to fetch a page
          }

          const nextPageData: TwitterResponse = await nextPageResponse.json();
          allPagesData.push(nextPageData);

          // Update token for the next iteration
          currentToken = nextPageData.meta?.next_token || null;
          currentPage++;

          // If there's no next token, we've reached the end of available tweets
          if (!currentToken) {
            break;
          }
        } catch (err) {
          console.error(`Error fetching page ${currentPage + 1}:`, err);
          break;
        }
      }

      // Combine the results from all pages
      const allTweets = allPagesData.flatMap((pageData) => pageData.data || []);

      // Build the page counts for metadata
      const pageCounts = allPagesData.map((pageData, index) => ({
        [`page_${index + 1}_count`]: pageData.data?.length || 0,
      }));

      // Combine the page counts into a single object
      const pageCountsObject = Object.assign({}, ...pageCounts);

      const combinedData = {
        data: allTweets,
        meta: {
          ...(allPagesData[allPagesData.length - 1]?.meta ?? {}),
          multi_page: true,
          pages_fetched: allPagesData.length,
          ...pageCountsObject,
          total_count: allTweets.length,
        },
        includes: allPagesData.reduce((acc, pageData) => {
          return {
            ...acc,
            ...(pageData.includes || {}),
          };
        }, {}),
      };

      return res.status(200).json(combinedData);
    }

    // If numberOfPages is 1 or there's no next_token, just return the first page data
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch tweets from Twitter API" });
  }
}
