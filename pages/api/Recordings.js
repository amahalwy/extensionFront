// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";

export default async (req, res) => {
  const prisma = new PrismaClient();
  const records = await prisma.recording
    .findMany()
    .then((recordings) => res.json(recordings));
};
