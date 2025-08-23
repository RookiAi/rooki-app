import { handlers } from "~/server/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextRequest } from "next/server";

export const { GET, POST } = handlers;

// For compatibility with older versions of Next.js
export default function authHandler(
  req: NextApiRequest, 
  _res: NextApiResponse
) {
  if (req.method === 'GET') {
    return GET(req as unknown as NextRequest);
  } else if (req.method === 'POST') {
    return POST(req as unknown as NextRequest);
  }
}
