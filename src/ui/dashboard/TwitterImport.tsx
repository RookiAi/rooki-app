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
    <div className="rounded-2xl bg-white overflow-hidden dark:bg-gray-800 shadow-xl">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 mix-blend-multiply"></div>
        <div className="px-8 py-12 relative z-10">
          <Heading level={2} className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Create Your Voice Profile
          </Heading>
          <Text className="mb-8 text-xl leading-relaxed text-gray-700 dark:text-gray-300 max-w-2xl">
            To get started, we'll import your Twitter data to help create your voice profile. 
            This helps us understand your natural tone and positioning, allowing our AI to 
            generate content that matches your authentic style.
          </Text>
        </div>
      </div>
      
      <div className="p-8">
        {error && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6 dark:bg-red-900/20 dark:border-red-800">
            <Heading level={3} className="text-red-800 text-lg font-medium dark:text-red-400 mb-2">Error</Heading>
            <Text className="text-red-700 dark:text-red-300">{error}</Text>
          </div>
        )}
        
        {success && (
          <div className="mb-8 rounded-xl border border-green-200 bg-green-50 p-6 dark:bg-green-900/20 dark:border-green-800">
            <Heading level={3} className="text-green-800 text-lg font-medium dark:text-green-400 mb-2">Success</Heading>
            <Text className="text-green-700 dark:text-green-300">Your voice has been created successfully!</Text>
          </div>
        )}
        
        <div className="flex justify-center">
          <Button 
            onClick={fetchTwitterData} 
            disabled={loading || !sessionData}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                <span>Importing Data...</span>
              </div>
            ) : (
              "Import Twitter Data"
            )}
          </Button>
        </div>
        
        {!sessionData && (
          <div className="mt-6 text-center">
            <Text className="text-red-500 dark:text-red-400 font-medium">
              You must be logged in to use this feature
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwitterImport;