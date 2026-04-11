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

const normalizeOrigin = (value: string) => value.trim().replace(/\/+$/, "");
const isAllowedOrigin = (origin: string) =>
  env.CLIENT_URLS.includes(origin) ||
  env.CLIENT_URL_PATTERNS_REGEX.some((pattern) => pattern.test(origin));

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = origin ? normalizeOrigin(origin) : origin;

      if (!normalizedOrigin || isAllowedOrigin(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      const allowedOrigins = [...env.CLIENT_URLS, ...env.CLIENT_URL_PATTERN_LIST];

      callback(
        new Error(
          `Origin nao permitida pelo CORS: ${normalizedOrigin}. Permitidas: ${allowedOrigins.join(", ")}`,
        ),
      );
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
