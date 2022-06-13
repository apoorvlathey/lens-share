import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { url } = query as { url: string };

  const response = await axios.get(url);
  const {
    request: { protocol, host, path },
  } = response;

  res.status(200).json(`${protocol}//${host}${path}`);
}
