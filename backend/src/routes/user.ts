import express from "express";
import { prisma } from "../../lib/db";
import { hash, compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";

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
        const token = sign(
          { id: user.id, name: user.name, password: user.password },
          process.env.JWT_SECRET!,
          { expiresIn: "1h" }
        );

        res.json(token).status(201);
      } else {
        res
          .status(401)
          .end("unauthorized login, check your credentials and try again.");
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
    } catch (error) {
      console.log(error);
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

// Authenticate before doing anything
router.use(["/photo", "/checker"], async (req, res, next) => {
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

// Profile picture route
router.patch("/photo", async (req, res) => {
  const { photo } = req.body;

  await prisma.user.update({
    where: {
      id: res.locals.userId,
    },
    data: {
      photo: photo,
    },
  });
  res.status(200).end("Added photo.");
});

router.get("/photo", async (req, res) => {
  const data = await prisma.user.findUnique({
    where: {
      id: res.locals.userId,
    },
    select: {
      name: true,
      photo: true,
    },
  });
  res.status(200).json(data);
});

// Load user's checkers
router.get("/checker", async (req, res) => {
  const { id } = req.body;
  console.log("Id: ", id);
  console.log("Res locals: ", res.locals);
  // TODO: Only the friend of the user can be a checker
  const checkers = await prisma.user.findMany({
    where: {
      id: {
        not: id ? id : res.locals.userId,
      },
    },
  });
  return res.status(200).json(checkers);
});

// Load user's profile data
router.get("/:name", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      name: req.params.name,
    },
    select: {
      name: true,
      photo: true,
      points: true,
      createdAt: true,
    },
  });
  return res.status(200).json(user);
});

export default router;
