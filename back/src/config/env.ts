import dotenv from "dotenv";
import { z } from "zod";

const envFile =
  process.env.NODE_ENV === "production" ? "production.env" : "development.env";

dotenv.config({ path: envFile });
dotenv.config();

const envSchema = z.object({
  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().default(3001),
  MONGODB_URI: z
    .string()
    .min(1)
    .default("mongodb://localhost:27017/an-event"),
  CLIENT_URL: z.string().default("http://localhost:8080"),
  CLIENT_URL_PATTERNS: z.string().optional(),
  MERCADO_PAGO_ENVIRONMENT: z.enum(["test", "production"]).default("test"),
  MERCADO_PAGO_ACCESS_TOKEN: z.string().min(1),
  PIX_NOTIFICATION_URL: z.string().optional(),
  MP_QR_MODE: z.enum(["static", "dynamic", "hybrid"]).default("static"),
  MP_STATIC_QR_DATA: z.string().optional(),
  MP_STORE_ID: z.coerce.number(),
  MP_STORE_EXTERNAL_ID: z.string().min(1),
  MP_POS_EXTERNAL_ID: z.string().min(1),
  MP_STORE_NAME: z.string().min(1),
});

const parsedEnv = envSchema.parse(process.env);

const normalizeOrigin = (value: string) => value.trim().replace(/\/+$/, "");
const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const globToRegex = (pattern: string) =>
  new RegExp(`^${escapeRegex(pattern).replace(/\\\*/g, ".*")}$`);

export const env = {
  ...parsedEnv,
  CLIENT_URLS: parsedEnv.CLIENT_URL.split(",")
    .map(normalizeOrigin)
    .filter(Boolean),
  CLIENT_URL_PATTERN_LIST: (parsedEnv.CLIENT_URL_PATTERNS ?? "")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean),
  CLIENT_URL_PATTERNS_REGEX: (parsedEnv.CLIENT_URL_PATTERNS ?? "")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean)
    .map(globToRegex),
};
