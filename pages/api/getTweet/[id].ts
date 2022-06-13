// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const token = process.env.TWITTER_BEARER_TOKEN;
const endpointURL = "https://api.twitter.com/2/tweets";

type Data = {
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query } = req;
  const { id } = query as { id: string };

  const response = await axios.get(`${endpointURL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      expansions: "attachments.media_keys",
      "media.fields": "media_key,type,url,preview_image_url",
      "tweet.fields": "entities",
    },
  });
  res.status(200).json(response.data);
}
