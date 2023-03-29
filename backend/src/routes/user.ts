import express from "express";
import { prisma } from "../../lib/db";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";

const router = express.Router();

// /user/
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.post("/signin", async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        name: name,
      },
    });

    if (!user) {
      res.status(404).end("No user found with that nickname.");
    } else {
      if (await compare(password, user?.password)) {
        const token = sign({id: user.id, name: user.name, password: user.password}, process.env.JWT_SECRET!, {expiresIn: '1h'});

        res.json(token).status(201);
      } else{
        res.status(401).end('unauthorized login, check your credentials and try again.');
      }
    }
  } catch {
    res.status(500).end("internal server error");
  }
});

router.post("/", async (req, res) => {
  const { name, password } = req.body;
  // Hash the password
  try {
    const hashed = await hash(password, 12);
    // Create the user
    try {
      const user = await prisma.user.create({
        data: {
          name: name,
          password: hashed,
        },
      });
      // Sign and return a token
      try {
        const token = sign(
          { id: user.id, name: user.name, password: user.password },
          process.env.JWT_SECRET!,
          { expiresIn: "1h" }
        );
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
