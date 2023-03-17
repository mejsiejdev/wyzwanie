import express from "express";
import { prisma } from "../../lib/db";

const router = express.Router();

router.get("/", async (req, res) => {
  const challenges = await prisma.challange.findMany();
  res.json(challenges);
  
});

export default router;
