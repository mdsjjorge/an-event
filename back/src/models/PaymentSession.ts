import { Schema, model } from "mongoose";

const paymentSessionSchema = new Schema(
  {
    giftId: {
      type: Schema.Types.ObjectId,
      ref: "Gift",
      required: true,
      index: true,
    },
    orderId: { type: String, required: true, unique: true, index: true },
    paymentId: { type: String, default: null, index: true },
    externalReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    accessToken: { type: String, required: true, unique: true, index: true },
    amount: { type: String, required: true },
    status: { type: String, required: true, default: "pending" },
    statusDetail: { type: String, default: "" },
    attendanceUnlocked: { type: Boolean, required: true, default: false },
    paidAt: { type: Date, default: null },
    lastWebhookAt: { type: Date, default: null },
    rsvpSubmittedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const PaymentSessionModel = model(
  "PaymentSession",
  paymentSessionSchema
);
