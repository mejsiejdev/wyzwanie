import express from "express";
import { prisma } from "../../lib/db";
import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";

const router = express.Router();

// /user/
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.post("/", async (req, res) => {
  const { name, password } = req.body;
  try {
    const hashed = await hash(password, 12);
    try {
      const user = await prisma.user.create({
        data: {
          name: name,
          password: hashed,
        },
      });
      try {
        const token = sign(user, process.env.JWT_SECRET!, { expiresIn: "1h" });
        res.status(201).json(token);
        return;
      } catch {
        res.status(500).end("Server error.");
        return;
      }
    } catch {
      res
        .status(400)
        .end("Account with specified name already exists in the database.");
      return;
    }
  } catch {
    res.status(500).end("Server error.");
    return;
  }
});

export default router;
