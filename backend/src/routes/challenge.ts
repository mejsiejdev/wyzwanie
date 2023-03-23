import express from "express";
import { prisma } from "../../lib/db";

const router = express.Router();

router.get("/", async (req, res) => {
  const challenges = await prisma.challenge.findMany();
  res.json(challenges);
});

router.get("/", async (req, res) => {
  const { content, expiresAt, points } = req.body;
  try {
    await prisma.challenge.create({
      data: {
        content: content,
        expiresAt: expiresAt,
        points: points,
      },
    });
  } catch {
    res.status(500);
  }
});

export default router;
