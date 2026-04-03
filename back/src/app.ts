import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { eventRouter } from "./routes/eventRoutes.js";
import { giftRouter } from "./routes/giftRoutes.js";
import { rsvpRouter } from "./routes/rsvpRoutes.js";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/event", eventRouter);
app.use("/api/gifts", giftRouter);
app.use("/api/rsvps", rsvpRouter);
