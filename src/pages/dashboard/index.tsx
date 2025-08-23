import Dashboard from "~/ui/dashboard";


export default function PageDashboard() {
  // return <Dashboard />;
  return <TestTelegram />;
}

function TestTelegram() {
  async function debug() {
    try {
      const response = await fetch('/api/telegram/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: 492148889,
          text: 'Hello from Rooki!!!!',
        }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const allMessages = await response.json();
      console.log('AgentMail messages:', allMessages);
    } catch (error) {
      console.error('Failed to fetch inbox messages:', error);
    }
  }
  return (
    <div>
      <button onClick={debug}>Debug</button>
    </div>
  );
}


function TestAgentMail() {
  async function debug() {
    try {
      const response = await fetch('/api/agentmail/listMessages');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const allMessages = await response.json();
      console.log('AgentMail messages:', allMessages);
    } catch (error) {
      console.error('Failed to fetch inbox messages:', error);
    }
  }
  return (
    <div>
      <button onClick={debug}>Debug</button>
    </div>
  );
}

// import { useSession } from "next-auth/react";
// import { useState } from "react";
// import { Button } from "~/components/button";
// import type { Tweet } from "~/types/tweet";
// import { api } from "~/utils/api";
// import { storeTweetsToSupabase } from "~/utils/supabase/storeTweetsToSupabase";

// export default function Dashboard() {
//   const { data: sessionData } = useSession();
//   const [loading, setLoading] = useState(false);
//   const [tweets, setTweets] = useState<any[] | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Get all voices for the current user
//   const { data: userVoices } = api.voice.getVoiceByUser.useQuery();
//   // Setup the mutation for updating storage URL
//   const updateVoiceStorageUrl = api.voice.updateStorageUrl.useMutation();

//   function normalizeTweet(text: string): string {
//     return (
//       text
//         // Replace URLs with [LINK]
//         .replace(/https?:\/\/\S+/gi, "[LINK]")
//         // Lowercase hashtags
//         .replace(/#\w+/g, (match) => match.toLowerCase())
//         // Lowercase mentions
//         .replace(/@\w+/g, (match) => match.toLowerCase())
//     );
//   }

//   const fetchTwitterData = async () => {
//     if (!sessionData) return;

//     // Check if we have any voices
//     if (!userVoices || userVoices.length === 0) {
//       throw new Error("No voices found for this user");
//     }

//     // Get the first voice and ensure it has an ID
//     const firstVoice = userVoices[0];
//     if (!firstVoice || !firstVoice.id) {
//       throw new Error("Invalid voice data");
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch("/api/twitter/getUserTweets", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           sessionData,
//           numberOfPages: 1,
//           excludeReplies: false,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to fetch tweets");
//       }

//       const data = await response.json();
//       console.log("Fetched tweets:", JSON.stringify(data));

//       console.log("Twitter API response:", data);

//       const allTweets: Tweet[] = data.data || [];

//       // Initialize groups
//       const posts: Tweet[] = [];
//       const quotes: Tweet[] = [];
//       const replies: Tweet[] = [];

//       for (const tweet of allTweets) {
//         const tweetText = normalizeTweet(tweet.text);

//         if (!tweet.referenced_tweets || tweet.referenced_tweets.length === 0) {
//           posts.push({
//             text: tweetText,
//             created_at: tweet.created_at,
//             id: tweet.id,
//           });
//         } else {
//           const types = tweet.referenced_tweets.map(
//             (rt: { type: string; id: string }) => rt.type,
//           );
//           if (types.includes("quoted")) {
//             quotes.push({
//               text: tweetText,
//               created_at: tweet.created_at,
//               id: tweet.id,
//             });
//           } else if (types.includes("replied_to")) {
//             replies.push({
//               text: tweetText,
//               created_at: tweet.created_at,
//               id: tweet.id,
//             });
//           }
//         }
//       }

//       const tweetsToStorage = {
//         posts,
//         quotes,
//         replies,
//       };

//       console.log("tweetsToStorage:", tweetsToStorage);

//       const { success, publicUrl } = await storeTweetsToSupabase(
//         sessionData.user.id,
//         tweetsToStorage,
//       );
//       console.log("Supabase storage URL:", publicUrl);

//       // fetch twitter user handle
//       const userResponse = await fetch("/api/twitter/getUserById", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           sessionData,
//         }),
//       });

//       if (!userResponse.ok) {
//         const errorData = await userResponse.json();
//         throw new Error(errorData.error || "Failed to fetch Twitter user data");
//       }

//       const twitterUserData = await userResponse.json();

//       // Update the storage URL for the first voice
//       const result = await updateVoiceStorageUrl.mutateAsync({
//         id: firstVoice.id,
//         url: publicUrl,
//         x_handle: twitterUserData.data.username as string,
//       });

//       console.log("Storage URL updated:", result);
//     } catch (err) {
//       console.error("Error fetching tweets:", err);
//       setError(
//         err instanceof Error ? err.message : "An unknown error occurred",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <main className="container mx-auto p-4">

//         <div className="mb-4">
//           <Button
//             onClick={fetchTwitterData}
//             disabled={
//               loading || !sessionData || !userVoices || userVoices.length === 0
//             }
//           >
//             {loading ? "Loading..." : "Fetch Twitter Data"}
//           </Button>
//           {!sessionData && (
//             <p className="mt-2 text-sm text-red-500">
//               You must be logged in to use this feature
//             </p>
//           )}
//         </div>

//         {error && (
//           <div className="mb-4 rounded-md bg-red-50 p-4 text-red-500">
//             <p>Error: {error}</p>
//           </div>
//         )}

//         {tweets && (
//           <div className="mt-6">
//             <h2 className="mb-4 text-xl font-semibold">
//               Retrieved Tweets ({tweets.length})
//             </h2>
//             {tweets.length === 0 ? (
//               <p>No tweets found.</p>
//             ) : (
//               <div className="overflow-hidden rounded-lg border border-gray-200">
//                 {tweets.map((tweet, index) => (
//                   <div
//                     key={tweet.id}
//                     className={`p-4 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-200`}
//                   >
//                     <p className="text-sm text-gray-500">
//                       {new Date(tweet.created_at).toLocaleString()}
//                     </p>
//                     <p className="mt-1">{tweet.text}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </main>
//     </>
//   );
// }
