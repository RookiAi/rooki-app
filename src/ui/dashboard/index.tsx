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
      <main className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <Text>Loading your data...</Text>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <Heading level={1} className="mb-6 text-center">Dashboard</Heading>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("voice")}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "voice"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Voice
          </button>
          <button
            onClick={() => setActiveTab("standup")}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "standup"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Standup
          </button>
        </nav>
      </div>
      
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 z-50">
          <Text>Processing...</Text>
        </div>
      )}
      
      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 dark:bg-red-900/20 dark:border-red-800">
          <Text className="text-red-700 dark:text-red-300">{error}</Text>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === "voice" && (
        <div className="tab-content">
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
      )}

      {activeTab === "standup" && (
        <div className="tab-content">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <Heading level={2} className="mb-4">Standup</Heading>
            <Text>Standup features coming soon.</Text>
          </div>
        </div>
      )}
    </main>
  );
}