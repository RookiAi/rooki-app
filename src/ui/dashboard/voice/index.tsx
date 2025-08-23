import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import VoiceDisplay from "./VoiceDisplay";
import VoiceEditor from "./VoiceEditor";
import TwitterImport from "./TwitterImport";
import TelegramConnect from "./TelegramConnect";

type Voice = {
  id: string;
  positioning: string | null;
  tone: any;
  voice_config?: any;
  x_handle?: string | null;
  storage_url?: string | null;
  telegram_chat_id?: string | null;
};

export default function VoiceTab() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voice, setVoice] = useState<Voice | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Get the user's voice
  const {
    data: userVoices,
    isLoading: isLoadingVoices,
    refetch: refetchVoices,
  } = api.voice.getVoiceByUser.useQuery(undefined, {
    enabled: true, // This will be controlled by the parent component's sessionData
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
          storage_url: firstVoice.storage_url,
          telegram_chat_id: firstVoice.telegram_chat_id,
        });
      }
    }
  }, [userVoices]);

  const handleEditToggle = () => {
    setIsEditing((prev: boolean) => !prev);
  };

  const handleVoiceUpdate = async (updatedVoice: {
    positioning: string;
    tone: any;
  }) => {
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
      <div className="flex h-64 items-center justify-center">
        <div className="flex animate-pulse flex-col items-center">
          <div className="mb-4 h-8 w-8 rounded-full bg-gray-200"></div>
          <p className="text-xl font-medium text-gray-400">
            Loading your data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {voice ? (
        <>
          {!isEditing ? (
            <div className="flex flex-col gap-8">
              <VoiceDisplay
                positioning={voice.positioning}
                tone={voice.tone}
                onEditToggle={handleEditToggle}
              />
              <TelegramConnect
                voiceId={voice.id}
                telegram_chat_id={voice.telegram_chat_id}
                onSuccess={() => refetchVoices()}
              />
            </div>
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

      {error && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-800 dark:bg-red-900/20">
          <p className="text-lg text-red-700 dark:text-red-300">
            {error}
          </p>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="flex items-center space-x-4 rounded-2xl bg-white p-6 shadow-lg">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-lg font-medium text-gray-900">
              Processing...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
