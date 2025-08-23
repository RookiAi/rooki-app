import type { NextApiRequest, NextApiResponse } from "next";
import { AgentMailClient } from "agentmail";
import { env } from "~/env";

const client = new AgentMailClient({
  apiKey: env.AGENTMAIL_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const messages = await client.inboxes.messages.list("intern@rooki.ai");

    // console.log("messages", messages);
    const message = messages.messages[0]!;

    const messageRes = await client.inboxes.messages.get(
      "intern@rooki.ai",
      message.message_id,
    );

    const standupResponse = await fetch(
      "http://130.211.209.31:8000/v1/standup/coach",
      {
        method: "POST",
        headers: {
          "x-api-key": "test-api-key",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "cmeojlmrc0000y5hgvlfeich6",
          user_message: messageRes.text,
        }),
      },
    );

    const standupData = await standupResponse.json();

    let replyMessage = `What do you think about this post?\n\n`;
    replyMessage += `${standupData.message}\n\n`;
    replyMessage += `Should I post about it?`;

    const reply = await client.inboxes.messages.reply(
      "intern@rooki.ai",
      message.message_id,
      {
        to: message.from,
        text: replyMessage,
      },
    );

    res.status(200).json({ data: reply });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}
