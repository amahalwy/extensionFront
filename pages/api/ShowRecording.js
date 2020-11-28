// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";

export default async (req, res) => {
  console.log(req.body);
  const prisma = new PrismaClient();
  const records = await prisma.recording
    .findUnique({ where: { id: Number(req.body.id) } })
    .then((recording) => res.json(recording));
};
