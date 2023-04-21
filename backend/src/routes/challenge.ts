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
      content: {
        contains:
          req.query.filter != "" ? req.query.filter?.toString() : undefined,
      },
    },
    orderBy: {
      expiresAt: "asc",
    },
  });
  res.status(200).json(challenges);
});

// Route for getting data to /check/:id
router.get("/:id", async (req, res) => {
  // Find challenge with a provided id
  const challenge = await prisma.challenge.findUnique({
    where: {
      id: req.params.id,
    },
  });
  if (challenge) {
    // Get data about author
    const author = await prisma.user.findUnique({
      where: {
        id: challenge.authorId,
      },
    });
    // Return it if everything is fine
    res.status(200).json({ challenge: challenge, author: author });
  } else {
    res.status(401).end("Challenge does not exist.");
  }
});

// Route for getting data from /check/:id
router.post("/check", async (req, res) => {
  const { approved } = req.body;
});

router.post("/", async (req, res) => {
  const { content, expiresAt, points, checker } = req.body;
  await prisma.challenge.create({
    data: {
      content: content,
      expiresAt: new Date(expiresAt),
      points: parseInt(points),
      authorId: res.locals.userId,
      checkerName: checker,
    },
  });
  res.status(201).end("Created new Challenge.");
});

router.patch("/", async (req, res) => {
  // Extract challenge id
  const { id } = req.body;

  try {
    // Check if the task has been already completed
    const challenge = await prisma.challenge.findUnique({
      where: {
        id: id,
      },
      select: {
        completedAt: true,
      },
    });
    if (challenge?.completedAt === null) {
      // Set task as complete, and get it's amount of points
      const { points } = await prisma.challenge.update({
        where: {
          id: id,
        },
        data: {
          completedAt: new Date(),
        },
        select: {
          points: true,
          completedAt: true,
        },
      });
      await prisma.user.update({
        where: {
          id: res.locals.userId,
        },
        data: {
          points: {
            increment: points,
          },
        },
      });
      // Return successful response if everything goes fine
      res.status(200).end("Successfully set challenge as complete.");
    } else {
      res.status(400).end("Challenge is already set as completed.");
    }
  } catch {
    // Return server error if something goes wrong
    res.status(500).end("Server error.");
  }
});

export default router;
