import { Router } from "express";
import { z } from "zod";
import { GiftModel } from "../models/Gift.js";

export const giftRouter = Router();

const giftInputSchema = z.object({
  name: z.string().trim().min(1, "Nome e obrigatorio."),
  description: z.string().trim().min(1, "Descricao e obrigatoria."),
  price: z.coerce.number().positive("Valor deve ser maior que zero."),
  imageUrl: z.string().url("imageUrl deve ser uma URL valida."),
  active: z.boolean().optional(),
  sortOrder: z.coerce.number().int().nonnegative().optional(),
});

const giftListSchema = z
  .array(giftInputSchema)
  .min(1, "Envie pelo menos um item para cadastro.");

giftRouter.get("/", async (_req, res) => {
  const gifts = await GiftModel.find({ active: true })
    .sort({ sortOrder: 1, createdAt: 1 })
    .lean();

  return res.json(
    gifts.map((gift) => ({
      id: String(gift._id),
      name: gift.name,
      description: gift.description,
      price: gift.price,
      imageUrl: gift.imageUrl,
    }))
  );
});

giftRouter.post("/", async (req, res) => {
  const parsed = giftListSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  const payload = parsed.data.map((gift, index) => ({
    ...gift,
    active: gift.active ?? true,
    sortOrder: gift.sortOrder ?? index + 1,
  }));

  const createdGifts = await GiftModel.insertMany(payload, { ordered: true });

  return res.status(201).json({
    message: "Presentes cadastrados com sucesso.",
    gifts: createdGifts.map((gift) => ({
      id: String(gift._id),
      name: gift.name,
      description: gift.description,
      price: gift.price,
      imageUrl: gift.imageUrl,
      active: gift.active,
      sortOrder: gift.sortOrder,
    })),
  });
});
