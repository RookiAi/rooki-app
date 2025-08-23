import { useState } from "react";
import { Button } from "~/components/button";
import { api } from "~/utils/api";
import { storeTweetsToSupabase } from "~/utils/supabase/storeTweetsToSupabase";
import { useSession } from "next-auth/react";
import { Heading } from "~/components/heading";
import { Text } from "~/components/text";

const TwitterImport = () => {
  const { data: sessionData } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Setup the mutation for creating a new voice
  const createVoice = api.voice.createVoice.useMutation();

  const fetchTwitterData = async () => {
    if (!sessionData) {
      setError("You must be logged in to use this feature");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Fetch tweets from Twitter API
      const response = await fetch("/api/twitter/getUserTweets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionData,
          numberOfPages: 1,
          excludeReplies: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch tweets");
      }

      const data = await response.json();
      const allTweets = data.data || [];

      // Format tweets for storage
      const tweetsToStorage = {
        posts: allTweets.map((tweet: any) => ({
          text: tweet.text,
          created_at: tweet.created_at,
          id: tweet.id,
        })),
      };

      // Store tweets in Supabase
      const { success, publicUrl } = await storeTweetsToSupabase(
        sessionData.user.id,
        tweetsToStorage,
      );

      if (!success || !publicUrl) {
        throw new Error("Failed to store tweets in Supabase");
      }

      // Fetch Twitter user handle
      const userResponse = await fetch("/api/twitter/getUserById", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionData,
        }),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.error || "Failed to fetch Twitter user data");
      }

      const twitterUserData = await userResponse.json();
      const xHandle = twitterUserData.data.username;

      // Create a new voice with the Twitter data
      await createVoice.mutateAsync({
        storage_url: publicUrl,
        x_handle: xHandle,
        positioning: "Default positioning from Twitter data",
        tone: JSON.stringify({ style: "default", source: "twitter" }),
      });

      setSuccess(true);
      
      // Reload the page to show the new voice
      window.location.reload();
    } catch (err) {
      console.error("Error fetching tweets:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Heading level={2} className="mb-4">Create Your Voice</Heading>
      <Text className="mb-6">
        To get started, we'll import your Twitter data to help create your voice. This helps us understand your tone and positioning.
      </Text>
      
      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 dark:bg-red-900/20 dark:border-red-800">
          <Heading level={3} className="text-red-800 text-sm font-medium dark:text-red-400">Error</Heading>
          <Text className="text-red-700 text-sm dark:text-red-300">{error}</Text>
        </div>
      )}
      
      {success && (
        <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4 dark:bg-green-900/20 dark:border-green-800">
          <Heading level={3} className="text-green-800 text-sm font-medium dark:text-green-400">Success</Heading>
          <Text className="text-green-700 text-sm dark:text-green-300">Your voice has been created successfully!</Text>
        </div>
      )}
      
      <Button 
        onClick={fetchTwitterData} 
        disabled={loading || !sessionData}
        className="mt-2"
      >
        {loading ? "Importing Data..." : "Import Twitter Data"}
      </Button>
      
      {!sessionData && (
        <Text className="mt-4 text-sm text-red-500 dark:text-red-400">
          You must be logged in to use this feature
        </Text>
      )}
    </div>
  );
};

export default TwitterImport;