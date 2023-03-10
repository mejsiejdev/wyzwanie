import express from "express";
import { prisma } from "../../lib/db";

const router = express.Router();

// /users/
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export default router;
