import { useState } from "react";
import { api } from "~/utils/api";
import { Text } from "~/components/text";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { Heading } from "~/components/heading";

type TelegramConnectProps = {
  voiceId: string;
  telegram_chat_id?: string | null;
  onSuccess?: () => void;
};

export default function TelegramConnect({
  voiceId,
  telegram_chat_id,
  onSuccess,
}: TelegramConnectProps) {
  const [secretCode, setSecretCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // If the user already has a Telegram chat ID, we consider them "connected"
  const isConnected = success || (!!telegram_chat_id && !isEditMode);

  const updateTelegramChatId = api.voice.updateTelegramChatId.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setIsEditMode(false);
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      setError(err.message || "Failed to update Telegram chat ID");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretCode.trim()) {
      setError("Please enter your Telegram secret code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await updateTelegramChatId.mutateAsync({
        id: voiceId,
        telegram_chat_id: secretCode,
      });
    } catch (err) {
      // Error is handled in the onError callback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mb-6 rounded-xl bg-white p-6 shadow-sm">
      {telegram_chat_id && !success && !isEditMode && (
        <div className="absolute top-6 right-6">
          <Button onClick={() => setIsEditMode(true)} className="text-sm">
            Update Connection
          </Button>
        </div>
      )}

      <Heading level={3} className="mb-4 text-xl font-semibold text-gray-900">
        Let's Chat on Telegram
        {isConnected && (
          <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Connected
          </span>
        )}
      </Heading>

      {(!isConnected || isEditMode) && (
        <div className="mb-6 space-y-4">
          <Text className="text-gray-700">
            Follow these steps to connect your Telegram account:
          </Text>

          <div className="space-y-3 border-l-2 border-blue-100 pl-4">
            <div className="flex items-start">
              <div className="mt-0.5 mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                1
              </div>
              <Text className="text-gray-700">
                <a
                  href="https://t.me/RookiAiBot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Click here to open Telegram
                </a>{" "}
                and start a chat with our bot{" "}
                <span className="rounded bg-gray-100 px-1 py-0.5 font-mono">
                  @RookiAiBot
                </span>
              </Text>
            </div>

            <div className="flex items-start">
              <div className="mt-0.5 mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                2
              </div>
              <Text className="text-gray-700">
                Type{" "}
                <span className="rounded bg-gray-100 px-1 py-0.5 font-mono">
                  /start
                </span>{" "}
                to initiate the chat with the bot
              </Text>
            </div>

            <div className="flex items-start">
              <div className="mt-0.5 mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                3
              </div>
              <Text className="text-gray-700">
                Copy the secret code from the bot and paste it below
              </Text>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {(!isConnected || isEditMode) && (
          <div>
            <Input
              id="secretCode"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              placeholder="Enter your Telegram secret code"
              disabled={isLoading}
              autoFocus={isEditMode}
            />
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <Text className="text-sm text-red-700">{error}</Text>
          </div>
        )}

        {(success || telegram_chat_id) && !isEditMode && (
          <div className="rounded-md bg-green-50 p-3">
            <Text className="text-sm text-green-700">
              We are connected on Telegram! 😄
              {telegram_chat_id && (
                <span className="mt-1 block font-mono text-xs text-green-600">
                  Chat ID: {success ? secretCode : telegram_chat_id}
                </span>
              )}
            </Text>
          </div>
        )}

        {telegram_chat_id && !success && isEditMode && (
          <div className="mt-2 rounded-md bg-blue-50 p-3">
            <Text className="text-sm text-blue-700">
              You already have a Telegram connection. Updating will replace your
              current connection.
            </Text>
            <div className="mt-2 flex justify-end">
              <Button onClick={() => setIsEditMode(false)} className="text-sm">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {isEditMode && (
          <Button
            type="submit"
            color={isConnected ? "zinc" : "indigo"}
            disabled={isLoading || (isConnected && !isEditMode)}
            className="w-full"
          >
            {isLoading
              ? "Connecting..."
              : isConnected
                ? "Connected to Telegram"
                : isEditMode
                  ? "Update Telegram Connection"
                  : "Connect Telegram"}
          </Button>
        )}
      </form>
    </div>
  );
}
