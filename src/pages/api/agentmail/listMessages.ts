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
  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }

  try {
    const messages = await client.inboxes.messages.list("intern@rooki.ai");
    res.status(200).json({ data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}
