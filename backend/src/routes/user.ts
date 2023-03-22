import express from "express";
import { prisma } from "../../lib/db";
import bcrypt from "bcrypt";

const router = express.Router();

// /user/
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.post("/", async (req, res) => {
  const { name, password } = req.body;

  bcrypt.hash(password, 3, async function (err, hash) {
    if (err) {
      res.status(500);
      console.error(err);
    }
    await prisma.user.create({
      data: {
        name: name,
        password: hash,
      },
    });
  });
});

export default router;
