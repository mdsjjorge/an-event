import { Router } from "express";
import { processMercadoPagoWebhook } from "../lib/mercadoPagoWebhook.js";

export const webhookRouter = Router();

webhookRouter.post("/", async (req, res) => {
  const payload = {
    query: req.query,
    headers: req.headers,
    body: req.body,
  };

  console.log(
    "Mercado Pago webhook received",
    JSON.stringify(payload, null, 2)
  );

  const session = await processMercadoPagoWebhook({
    body: (req.body ?? {}) as Record<string, unknown>,
    query: req.query as Record<string, unknown>,
    headers: req.headers as Record<string, unknown>,
  });

  return res.status(200).json({
    message: "Webhook recebido com sucesso.",
    paymentRecognized: Boolean(session),
    received: payload,
  });
});
