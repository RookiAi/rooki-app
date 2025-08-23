export const storeTweetsToSupabase = async (
  userId: string,
  tweetsData: any,
) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `tweets_${userId}_${timestamp}.json`;

    const response = await fetch("/api/supabase/storage/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        filename,
        data: tweetsData,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to upload tweets to storage");
    }

    const result = await response.json();
    console.log("Tweets stored successfully:", result);
    return result;
  } catch (error) {
    console.error("Error storing tweets:", error);
    throw error;
  }
};
