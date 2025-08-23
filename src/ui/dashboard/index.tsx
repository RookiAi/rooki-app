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
  x_handle?: string | null;
  storage_url?: string | null;
};

export default function Dashboard() {
  const { data: sessionData } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voice, setVoice] = useState<Voice | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
          <Text>Loading your voice data...</Text>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <Heading level={1} className="mb-8 text-center">Voice Dashboard</Heading>
      
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
    </main>
  );
}