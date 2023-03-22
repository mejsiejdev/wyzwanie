import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// Configure CORS and body-parser
import cors from "cors";
import BodyParser from "body-parser";
app.use(cors());
app.use(BodyParser.json());

// Import routes' routers
import user from "./routes/user";
import challenge from "./routes/challenge";

app.use("/user", user);
app.use("/challenge", challenge);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
