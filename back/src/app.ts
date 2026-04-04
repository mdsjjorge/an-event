import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { eventRouter } from "./routes/eventRoutes.js";
import { giftRouter } from "./routes/giftRoutes.js";
import { paymentRouter } from "./routes/paymentRoutes.js";
import { rsvpRouter } from "./routes/rsvpRoutes.js";
import { webhookRouter } from "./routes/webhookRoutes.js";

export const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.CLIENT_URLS.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin nao permitida pelo CORS."));
    },
  }),
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/event", eventRouter);
app.use("/api/gifts", giftRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/rsvps", rsvpRouter);
app.use("/api/webhooks", webhookRouter);
