import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import VoiceDisplay from "./VoiceDisplay";
import VoiceEditor from "./VoiceEditor";
import TwitterImport from "./TwitterImport";
import TelegramConnect from "./TelegramConnect";
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
  telegram_chat_id?: string | null;
};

type TabType = "voice" | "standup" | "salary";

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
    refetch: refetchVoices,
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
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex h-64 items-center justify-center">
            <div className="flex animate-pulse flex-col items-center">
              <div className="mb-4 h-8 w-8 rounded-full bg-gray-200"></div>
              <Text className="text-xl font-medium text-gray-400">
                Loading your data...
              </Text>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-12 flex justify-center">
          <nav className="flex space-x-12" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("voice")}
              className={`group flex flex-col items-center transition-all duration-300 ease-in-out`}
            >
              <span
                className={`mb-2 text-xl font-medium ${
                  activeTab === "voice"
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              >
                Intern's Voice
              </span>
              <div
                className={`h-1 w-8 rounded-full transition-all duration-300 ${
                  activeTab === "voice"
                    ? "w-16 bg-blue-600"
                    : "bg-transparent group-hover:bg-gray-200"
                }`}
              ></div>
            </button>

            <button
              onClick={() => setActiveTab("standup")}
              className={`group flex flex-col items-center transition-all duration-300 ease-in-out`}
            >
              <span
                className={`mb-2 text-xl font-medium ${
                  activeTab === "standup"
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              >
                Daily Standup with Intern
              </span>
              <div
                className={`h-1 w-8 rounded-full transition-all duration-300 ${
                  activeTab === "standup"
                    ? "w-16 bg-blue-600"
                    : "bg-transparent group-hover:bg-gray-200"
                }`}
              ></div>
            </button>

            <button
              onClick={() => setActiveTab("salary")}
              className={`group flex flex-col items-center transition-all duration-300 ease-in-out`}
            >
              <span
                className={`mb-2 text-xl font-medium ${
                  activeTab === "salary"
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              >
                Intern's Salary
              </span>
              <div
                className={`h-1 w-8 rounded-full transition-all duration-300 ${
                  activeTab === "salary"
                    ? "w-16 bg-blue-600"
                    : "bg-transparent group-hover:bg-gray-200"
                }`}
              ></div>
            </button>
          </nav>
        </div>

        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="flex items-center space-x-4 rounded-2xl bg-white p-6 shadow-lg">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <Text className="text-lg font-medium text-gray-900">
                Processing...
              </Text>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-800 dark:bg-red-900/20">
            <Text className="text-lg text-red-700 dark:text-red-300">
              {error}
            </Text>
          </div>
        )}

        {/* Tab Content with Animation */}
        <div className="relative">
          {/* Voice Tab */}
          <div
            className={`transition-opacity duration-500 ${
              activeTab === "voice"
                ? "pointer-events-auto z-10 opacity-100"
                : "pointer-events-none absolute inset-0 z-0 opacity-0"
            }`}
          >
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
          </div>

          {/* Standup Tab */}
          <div
            className={`transition-opacity duration-500 ${
              activeTab === "standup"
                ? "pointer-events-auto z-10 opacity-100"
                : "pointer-events-none absolute inset-0 z-0 opacity-0"
            }`}
          >
            <div className="overflow-hidden rounded-2xl bg-white p-8 shadow-xl">
              <Heading
                level={2}
                className="mb-6 text-3xl font-bold text-gray-900"
              >
                Standup
              </Heading>
              <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-8">
                <svg
                  className="mb-4 h-16 w-16 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <Text className="mb-2 text-center text-xl font-medium text-gray-600">
                  Standup features coming soon
                </Text>
                <Text className="max-w-md text-center text-gray-500 dark:text-gray-400">
                  We're working on new features to make your standups more
                  efficient and insightful.
                </Text>
              </div>
            </div>
          </div>

          {/* Salary Tab */}
          <div
            className={`transition-opacity duration-500 ${
              activeTab === "salary"
                ? "pointer-events-auto z-10 opacity-100"
                : "pointer-events-none absolute inset-0 z-0 opacity-0"
            }`}
          >
            <div className="overflow-hidden rounded-2xl bg-white p-8 shadow-xl">
              <Heading
                level={2}
                className="mb-6 text-3xl font-bold text-gray-900"
              >
                Salary
              </Heading>
              <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-8">
                <svg
                  className="mb-4 h-16 w-16 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <Text className="mb-2 text-center text-xl font-medium text-gray-600 dark:text-gray-300">
                  Salary features coming soon
                </Text>
                <Text className="max-w-md text-center text-gray-500 dark:text-gray-400">
                  We're working on new features to make your salary management
                  more efficient and insightful.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
