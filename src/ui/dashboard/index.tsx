// filepath: /Users/jingles/Documents/GitHub/rooki-app/src/ui/dashboard/index.tsx
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import VoiceDisplay from "./VoiceDisplay";
import VoiceEditor from "./VoiceEditor";
import TwitterImport from "./TwitterImport";
import { Text } from "~/components/text";
import { Heading } from "~/components/heading";
import { Button } from "~/components/button";

// Define the Voice type based on our schema
type Voice = {
  id: string;
  positioning: string | null;
  tone: any;
  voice_config?: any;
  x_handle?: string | null;
  storage_url?: string | null;
};

type TabType = "voice" | "standup";

export default function Dashboard() {
  const { data: sessionData } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voice, setVoice] = useState<Voice | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("voice");

  // Get the user's voice
  const { 
    data: userVoices, 
    isLoading: isLoadingVoices,
    refetch: refetchVoices
  } = api.voice.getVoiceByUser.useQuery(undefined, {
    enabled: !!sessionData,
  });

  // Setup the update voice mutation
  const updateVoice = api.voice.updateVoice.useMutation({
    onSuccess: () => {
      refetchVoices();
    },
  });

  // Update voice state when userVoices data changes
  useEffect(() => {
    if (userVoices && userVoices.length > 0) {
      // Convert from DB model to our Voice type
      const firstVoice = userVoices[0];
      if (firstVoice) {
        setVoice({
          id: firstVoice.id,
          positioning: firstVoice.positioning,
          tone: firstVoice.tone,
          voice_config: firstVoice.voice_config,
          x_handle: firstVoice.x_handle,
          storage_url: firstVoice.storage_url
        });
      }
    }
  }, [userVoices]);

  const handleEditToggle = () => {
    setIsEditing((prev: boolean) => !prev);
  };

  const handleVoiceUpdate = async (updatedVoice: { positioning: string; tone: any }) => {
    if (!voice) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await updateVoice.mutateAsync({
        id: voice.id,
        positioning: updatedVoice.positioning,
        tone: updatedVoice.tone,
      });
      
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating voice:", err);
      setError(err instanceof Error ? err.message : "Failed to update voice");
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingVoices) {
    return (
      <main className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 mb-4"></div>
              <Text className="text-xl font-medium text-gray-400 dark:text-gray-500">Loading your data...</Text>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* <Heading level={1} className="text-center text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-16">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
            Intern
          </span>
        </Heading> */}
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <nav className="flex space-x-12" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("voice")}
              className={`group flex flex-col items-center transition-all duration-300 ease-in-out`}
            >
              <span className={`text-xl font-medium mb-2 ${
                activeTab === "voice"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
              }`}>
                Intern's Voice
              </span>
              <div className={`h-1 w-8 rounded-full transition-all duration-300 ${
                activeTab === "voice" 
                  ? "bg-blue-600 dark:bg-blue-400 w-16" 
                  : "bg-transparent group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
              }`}></div>
            </button>
            
            <button
              onClick={() => setActiveTab("standup")}
              className={`group flex flex-col items-center transition-all duration-300 ease-in-out`}
            >
              <span className={`text-xl font-medium mb-2 ${
                activeTab === "standup"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
              }`}>
                Daily Standup with Intern
              </span>
              <div className={`h-1 w-8 rounded-full transition-all duration-300 ${
                activeTab === "standup" 
                  ? "bg-blue-600 dark:bg-blue-400 w-16" 
                  : "bg-transparent group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
              }`}></div>
            </button>
          </nav>
        </div>
        
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center space-x-4">
              <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <Text className="text-lg font-medium text-gray-900 dark:text-white">Processing...</Text>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6 dark:bg-red-900/20 dark:border-red-800 shadow-sm">
            <Text className="text-red-700 dark:text-red-300 text-lg">{error}</Text>
          </div>
        )}

        {/* Tab Content with Animation */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          {/* Voice Tab */}
          <div 
            className={`transition-opacity duration-500 ${
              activeTab === "voice" ? "opacity-100 z-10" : "opacity-0 z-0 absolute inset-0"
            }`}
          >
            {voice ? (
              <>
                {!isEditing ? (
                  <VoiceDisplay
                    positioning={voice.positioning}
                    tone={voice.tone}
                    onEditToggle={handleEditToggle}
                  />
                ) : (
                  <VoiceEditor
                    positioning={voice.positioning}
                    tone={voice.tone}
                    onUpdate={handleVoiceUpdate}
                  />
                )}
              </>
            ) : (
              <TwitterImport />
            )}
          </div>

          {/* Standup Tab */}
          <div 
            className={`transition-opacity duration-500 ${
              activeTab === "standup" ? "opacity-100 z-10" : "opacity-0 z-0 absolute inset-0"
            }`}
          >
            <div className="rounded-2xl bg-white overflow-hidden p-8 dark:bg-gray-800">
              <Heading level={2} className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Standup</Heading>
              <div className="p-8 rounded-xl bg-gray-50 dark:bg-gray-700 flex flex-col items-center justify-center">
                <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <Text className="text-xl font-medium text-gray-600 dark:text-gray-300 text-center mb-2">
                  Standup features coming soon
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                  We're working on new features to make your standups more efficient and insightful.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}