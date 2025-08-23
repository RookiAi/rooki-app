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
    const sentMessage = await client.inboxes.messages.send("intern@rooki.ai", {
      to: ["xiao_laoshu@hotmail.com"],
      labels: ["outreach", "startup"],
      subject: "test email send",
      text: "Hello, I am Rooki Intern",
      html: '<div dir="ltr">Hello,<br /><br />I am Rooki Intern',
    });
    console.log(`Message sent successfully with ID: ${sentMessage}`);

    res.status(200).json({ data: sentMessage });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}
