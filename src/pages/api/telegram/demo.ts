import { type NextApiRequest, type NextApiResponse } from "next";
import { sendTelegramMessage } from "~/utils/telegram/sendMessage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    let outputMessage = `Boss, looks like there is a buzz about YC Agents Hackathon, shall we write something about how we use AI and post it?\n\n`;
    // outputMessage += `Here's a draft:\n\n`;

    // const response = await fetch(
    //   "http://130.211.209.31:8000/v1/standup/coach",
    //   {
    //     method: "POST",
    //     headers: {
    //       "x-api-key": "test-api-key",
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       user_id: "cmeojlmrc0000y5hgvlfeich6",
    //       user_message: `Let's highlight how Rooki can be every startup's social media manager`,
    //     }),
    //   },
    // );

    // const data = await response.json();
    // outputMessage += `${data.message}\n\n`;

    // Send the message using our utility function
    const result = await sendTelegramMessage(`492148889`, outputMessage);

    // Return the Telegram API response
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
}
