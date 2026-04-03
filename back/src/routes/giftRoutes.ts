import { Router } from "express";
import { GiftModel } from "../models/Gift.js";

export const giftRouter = Router();

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
      imageKey: gift.imageKey,
    }))
  );
});
