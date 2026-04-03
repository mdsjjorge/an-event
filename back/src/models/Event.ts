import { Schema, model } from "mongoose";

const eventSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    navTitle: { type: String, required: true },
    eventTitle: { type: String, required: true },
    eventSubtitle: { type: String, required: true },
    giftSectionTitle: { type: String, required: true },
    giftSectionDescription: { type: String, required: true },
    rsvpTitle: { type: String, required: true },
    rsvpDescription: { type: String, required: true },
    footerText: { type: String, required: true },
    pixKey: { type: String, required: true },
    pixCity: { type: String, required: true },
    supportPhone: { type: String, required: true },
  },
  { timestamps: true }
);

export const EventModel = model("Event", eventSchema);
