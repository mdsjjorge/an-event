import { Router } from "express";
import { z } from "zod";
import { markRsvpAsUsed } from "../lib/mercadoPagoWebhook.js";
import { RsvpModel } from "../models/Rsvp.js";

export const rsvpRouter = Router();

const rsvpSchema = z.object({
  name: z.string().trim().min(1, "Por favor, informe seu nome."),
  guests: z.coerce.number().int().min(0).max(3),
  accessToken: z.string().trim().min(1, "Pagamento nao vinculado."),
});

rsvpRouter.get("/", async (_req, res) => {
  const rsvps = await RsvpModel.find().sort({ createdAt: -1 }).lean();

  return res.json(
    rsvps.map((rsvp) => ({
      id: String(rsvp._id),
      name: rsvp.name,
      guests: rsvp.guests,
      createdAt: rsvp.createdAt,
    }))
  );
});

rsvpRouter.post("/", async (req, res) => {
  const parsed = rsvpSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  const authorizedPayment = await markRsvpAsUsed(parsed.data.accessToken);

  if (!authorizedPayment) {
    return res.status(403).json({
      message:
        "A confirmacao de presenca so e liberada apos a aprovacao do pagamento Pix.",
    });
  }

  const rsvp = await RsvpModel.create({
    name: parsed.data.name,
    guests: parsed.data.guests,
  });

  return res.status(201).json({
    message: "Presenca confirmada com sucesso.",
    rsvp: {
      id: String(rsvp._id),
      name: rsvp.name,
      guests: rsvp.guests,
      createdAt: rsvp.createdAt,
    },
  });
});
