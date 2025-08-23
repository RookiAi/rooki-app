import { type NextApiRequest, type NextApiResponse } from "next";
import { sendTelegramMessage } from "~/utils/telegram/sendMessage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { chatId, text, options } = req.body;

    // Validate required parameters
    if (!chatId || !text) {
      return res.status(400).json({ error: "Missing required parameters: chatId and text" });
    }

    // Send the message using our utility function
    const result = await sendTelegramMessage(chatId, text, options);
    
    // Return the Telegram API response
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
}
