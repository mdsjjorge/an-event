import { Schema, model } from "mongoose";

const rsvpSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    guests: { type: Number, required: true, min: 0, max: 3 },
  },
  { timestamps: true }
);

export const RsvpModel = model("Rsvp", rsvpSchema);
