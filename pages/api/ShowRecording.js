// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";

export default async (req, res) => {
  const prisma = new PrismaClient();
  const records = await prisma.recording;
  // .findOne((where: {id:Number(params.id)}))
  // .then((recordings) => res.json(recordings));
};
