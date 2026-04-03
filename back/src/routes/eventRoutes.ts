import { Router } from "express";
import { EventModel } from "../models/Event.js";

export const eventRouter = Router();

eventRouter.get("/", async (_req, res) => {
  const event = await EventModel.findOne({ slug: "main-event" }).lean();

  if (!event) {
    return res.status(404).json({ message: "Evento nao encontrado." });
  }

  return res.json({
    id: String(event._id),
    navTitle: event.navTitle,
    eventTitle: event.eventTitle,
    eventSubtitle: event.eventSubtitle,
    giftSectionTitle: event.giftSectionTitle,
    giftSectionDescription: event.giftSectionDescription,
    rsvpTitle: event.rsvpTitle,
    rsvpDescription: event.rsvpDescription,
    footerText: event.footerText,
    pixKey: event.pixKey,
    pixCity: event.pixCity,
    supportPhone: event.supportPhone,
  });
});
