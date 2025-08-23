import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env";
import { Autumn } from "autumn-js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const { sessionData, amount } = req.body;

  const userId = sessionData?.id;

  try {
    const autumn = new Autumn({ secretKey: env.AUTUMN_SECRET_KEY });

    const { data } = await autumn.checkout({
      customer_id: userId,
      product_id: "intern",
      options: [{ feature_id: "work_done", quantity: amount }],
    });

    res.status(200).json({ data: data });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}
