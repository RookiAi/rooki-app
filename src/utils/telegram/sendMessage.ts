import { env } from "~/env";

/**
 * Sends a message to a Telegram chat
 * @param chatId The Telegram chat ID to send the message to
 * @param text The message text to send
 * @param options Additional options for the message
 * @returns The API response from Telegram
 */
export async function sendTelegramMessage(
  chatId: number | string,
  text: string,
  options?: {
    parseMode?: "HTML" | "MarkdownV2" | "Markdown";
    disableWebPagePreview?: boolean;
    disableNotification?: boolean;
    replyToMessageId?: number;
  }
) {
  const response = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: options?.parseMode,
        disable_web_page_preview: options?.disableWebPagePreview,
        disable_notification: options?.disableNotification,
        reply_to_message_id: options?.replyToMessageId,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Telegram API error: ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}
