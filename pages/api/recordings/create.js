// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req, res) => {
  // Test in postman with body as object of {"hi": "hello"}
  const { screenUrl, events } = req.body;
  const data = {
    screenUrl,
    events,
  };

  const recording = await prisma.recording.create({ data });
  res.json(recording);
};
