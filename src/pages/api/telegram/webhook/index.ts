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
      const messageText = update.message.text || "";

      // Check if the message is the /start command
      if (messageText === "/start") {
        // Reply with the chat ID when user sends /start
        await sendTelegramMessage(
          chatId,
          `Hi, I am Rooki! Your AI intern to grow your social media presence. I learn your company's positioning + tone, doom-scroll 24/7, and surface only the trends worth jumping on.\n\nWhen action's needed, I will ping you here on Telegram with a ready-to-post draft. Want a long-form tweet or to tweak positioning? Email me—I'll handle it. You build; I handle the timeline. Feel free to send me a message anytime!\n\nPsst, this is our secret code, ${chatId}, put it on the dashboard and I'll know you're ready to take action.`,
        );
      } else {
        const response = await fetch(
          "http://130.211.209.31:8000/v1/standup/coach",
          {
            method: "POST",
            headers: {
              "x-api-key": "test-api-key",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: "cmeojlmrc0000y5hgvlfeich6",
              user_message: messageText,
            }),
          },
        );

        const data = await response.json();

        await sendTelegramMessage(chatId, data.message);
      }
    }

    // Return success response to Telegram
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error handling Telegram webhook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
