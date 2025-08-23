import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

export default function Dashboard() {
  const { data: sessionData } = useSession();

  const {
    data: voices,
    isLoading,
    error,
  } = api.voice.getVoiceByUserId.useQuery(undefined, {
    enabled: !!sessionData,
    retry: 1,
  });

  return (
    <>
      <main>
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-2xl font-bold">Your Voices</h1>

          {isLoading ? (
            <p>Loading your voices...</p>
          ) : error ? (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-red-700 dark:text-red-200">
                Error loading voices. Please try again later.
              </p>
            </div>
          ) : !voices?.length ? (
            <p>You don't have any voices yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {voices.map((voice) => (
                <div
                  key={voice.id}
                  className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <h2 className="mb-2 font-semibold">@{voice.xHandle}</h2>
                  <p className="text-sm text-zinc-500">
                    Voice Config: {voice.voiceConfig}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
