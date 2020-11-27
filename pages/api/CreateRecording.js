// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";

export default async (req, res) => {
  // Test in postman with body as object of {"hi": "hello"}
  const { screenUrl, events } = req.body;
  const data = {
    screenUrl,
    events,
  };

  console.log({ data });
  const prisma = new PrismaClient();
  const records = await prisma.recording
    .create({ data })
    .then((recording) => res.json(recording));
  // Need the data types here to create a recording instance//
};
