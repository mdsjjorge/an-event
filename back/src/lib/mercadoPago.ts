import { randomUUID } from "node:crypto";

export const formatAmountString = (value: number) => value.toFixed(2);

export const buildProjectIdempotencyKey = (input: {
  operation: string;
  giftId: string;
  amount: string;
  reference: string;
}) => {
  void input;
  return randomUUID();
};
