// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";

export default async (req, res) => {
  const prisma = new PrismaClient();
  const recording = await prisma.recording.findUnique({
    where: { id: Number(req.body.id) },
  });
  res.json(recording);
};
