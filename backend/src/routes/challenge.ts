import express from "express";
import { verify } from "jsonwebtoken";
import { prisma } from "../../lib/db";

const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).end("Lack of authorization header.");
  } else {
    try {
      const decoded = verify(
        req.headers.authorization,
        process.env.JWT_SECRET!
      );
      console.log(decoded);
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
          const challenges = await prisma.challenge.findMany({
            where: {
              authorId: user.id,
            },
          });
          console.log("Challenges:", challenges);
          res.status(200).json(challenges);
        }
      } catch {
        res.status(500).end("Server error.");
      }
    } catch {
      res.status(401).end("Invalid token.");
    }
  }
});

router.post("/", async (req, res) => {
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
