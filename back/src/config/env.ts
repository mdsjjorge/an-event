import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  MONGODB_URI: z
    .string()
    .min(1)
    .default("mongodb://localhost:27017/an-event"),
  CLIENT_URL: z.string().default("http://localhost:8080"),
  MERCADO_PAGO_ACCESS_TOKEN: z.string().min(1),
  PIX_NOTIFICATION_URL: z.string().optional(),
});

export const env = envSchema.parse(process.env);
