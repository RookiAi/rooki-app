import { type NextApiRequest, type NextApiResponse } from "next";
const { sendTelegramMessage } = await import("~/utils/telegram/sendMessage");

type TelegramUpdate = {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      first_name: string;
      username?: string;
      type: string;
    };
    date: number;
    text?: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse the update from Telegram
    const update = req.body as TelegramUpdate;

    // Check if there's a message with a chat ID
    if (update.message?.chat?.id) {
      const chatId = update.message.chat.id;

      // Send reply message "hi" using our utility function
      await sendTelegramMessage(chatId, `hi, your chat id is ${chatId}`);
    }

    // Return success response to Telegram
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error handling Telegram webhook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
