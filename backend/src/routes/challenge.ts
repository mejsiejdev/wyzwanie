import express from "express";
import { verify } from "jsonwebtoken";
import { prisma } from "../../lib/db";

const router = express.Router();

// Authenticate before doing anything
router.use(async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).end("Lack of authorization header.");
  } else {
    try {
      const decoded = verify(
        req.headers.authorization,
        process.env.JWT_SECRET!
      );
      try {
        const user = await prisma.user.findUnique({
          where: {
            // @ts-ignore
            name: decoded.name,
          },
        });
        if (
          !user ||
          // @ts-ignore
          user.password != decoded.password ||
          // @ts-ignore
          user.id != decoded.id
        ) {
          res.status(401).end("Falsified token.");
        } else {
          res.locals.userId = user.id;
          next();
        }
      } catch {
        res.status(500).end("Server error.");
      }
    } catch {
      res.status(401).end("Invalid token.");
    }
  }
});

router.get("/", async (req, res) => {
  const challenges = await prisma.challenge.findMany({
    where: {
      authorId: res.locals.userId,
    },
    orderBy: {
      expiresAt: "asc",
    },
  });
  res.status(200).json(challenges);
});

router.post("/", async (req, res) => {
  const { content, expiresAt, points } = req.body;
  await prisma.challenge.create({
    data: {
      content: content,
      expiresAt: new Date(expiresAt),
      points: parseInt(points),
      authorId: res.locals.userId,
    },
  });
  res.status(201).end("Created new Challenge.");
});

export default router;
