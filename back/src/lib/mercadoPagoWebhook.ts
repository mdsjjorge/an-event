import axios from "axios";
import { env } from "../config/env.js";
import { PaymentSessionModel } from "../models/PaymentSession.js";

type MercadoPagoOrderResponse = {
  id?: string | number;
  external_reference?: string;
  status?: string;
  status_detail?: string;
  total_amount?: string | number;
  transactions?: {
    payments?: Array<{
      id?: string | number;
      status?: string;
      status_detail?: string;
      amount?: string | number;
      paid_at?: string;
      date_approved?: string;
      date_created?: string;
    }>;
  };
};

type MercadoPagoPaymentResponse = {
  id?: string | number;
  external_reference?: string;
  status?: string;
  status_detail?: string;
  transaction_amount?: string | number;
  date_approved?: string;
  date_created?: string;
};

const APPROVED_PAYMENT_STATUSES = new Set([
  "approved",
  "accredited",
  "processed",
]);
const APPROVED_PAYMENT_STATUS_DETAILS = new Set(["approved", "accredited"]);

type NotificationInput = {
  body: Record<string, unknown>;
  query: Record<string, unknown>;
  headers?: Record<string, unknown>;
};

const mercadoPagoHeaders = () => ({
  Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
  "Content-Type": "application/json",
});

const parseResourceId = (value: unknown) => {
  if (typeof value !== "string") {
    return null;
  }

  const parts = value.split("/").filter(Boolean);
  return parts.at(-1) ?? null;
};

const extractNotificationDetails = (input: NotificationInput) => {
  const bodyType = typeof input.body.type === "string" ? input.body.type : null;
  const bodyAction =
    typeof input.body.action === "string" ? input.body.action : null;
  const queryTopic =
    typeof input.query.topic === "string" ? input.query.topic : null;
  const queryType =
    typeof input.query.type === "string" ? input.query.type : null;
  const bodyData =
    input.body.data && typeof input.body.data === "object"
      ? (input.body.data as Record<string, unknown>)
      : null;

  const orderId =
    (typeof bodyData?.id === "string" || typeof bodyData?.id === "number"
      ? String(bodyData.id)
      : null) ??
    (typeof input.query["data.id"] === "string"
      ? String(input.query["data.id"])
      : null) ??
    parseResourceId(input.body.resource) ??
    (queryTopic === "merchant_order" || queryType === "merchant_order"
      ? typeof input.query.id === "string"
        ? input.query.id
        : null
      : null);

  const paymentId =
    bodyType === "payment" ||
    queryTopic === "payment" ||
    queryType === "payment"
      ? typeof bodyData?.id === "string" || typeof bodyData?.id === "number"
        ? String(bodyData.id)
        : typeof input.query.id === "string"
          ? input.query.id
          : parseResourceId(input.body.resource)
      : null;

  const normalizedType = bodyType ?? queryType ?? queryTopic ?? bodyAction;

  return {
    type: normalizedType,
    orderId,
    paymentId,
  };
};

const fetchMercadoPagoOrder = async (orderId: string) => {
  const response = await axios.get<MercadoPagoOrderResponse>(
    `https://api.mercadopago.com/v1/orders/${orderId}`,
    {
      headers: mercadoPagoHeaders(),
      validateStatus: () => true,
    },
  );

  // if (response.status < 200 || response.status >= 300) {
  //   throw new Error(`Mercado Pago order lookup failed with status ${response.status}.`);
  // }

  return response.data;
};

const fetchMercadoPagoPayment = async (paymentId: string) => {
  const response = await axios.get<MercadoPagoPaymentResponse>(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: mercadoPagoHeaders(),
      validateStatus: () => true,
    },
  );

  if (response.status < 200 || response.status >= 300) {
    throw new Error(
      `Mercado Pago payment lookup failed with status ${response.status}.`,
    );
  }

  return response.data;
};

const upsertPaymentStatus = async (params: {
  orderId?: string | null;
  paymentId?: string | null;
  externalReference?: string | null;
  amount?: string | number | null;
  status?: string | null;
  statusDetail?: string | null;
  paidAt?: string | null;
  action?: string | null;
}) => {
  const status = params.status ?? "pending";
  const statusDetail = params.statusDetail ?? "";
  const attendanceUnlocked =
    APPROVED_PAYMENT_STATUS_DETAILS.has(statusDetail) ||
    (APPROVED_PAYMENT_STATUSES.has(status) &&
      (status === "approved" ||
        status === "accredited" ||
        statusDetail === "accredited")) ||
    params.action === "order.processed";
  const paidAt = params.paidAt ? new Date(params.paidAt) : null;

  const session =
    (params.orderId
      ? await PaymentSessionModel.findOne({ orderId: params.orderId })
      : null) ??
    (params.paymentId
      ? await PaymentSessionModel.findOne({ paymentId: params.paymentId })
      : null) ??
    (params.externalReference
      ? await PaymentSessionModel.findOne({
          externalReference: params.externalReference,
        })
      : null);

  if (!session) {
    return null;
  }

  if (params.paymentId) {
    session.paymentId = params.paymentId;
  }

  session.status = status;
  session.statusDetail = statusDetail;
  session.amount = String(params.amount ?? session.amount);
  session.attendanceUnlocked = attendanceUnlocked;
  session.paidAt = paidAt ?? session.paidAt;
  session.lastWebhookAt = new Date();

  await session.save();

  return session;
};

const getBodyData = (body: Record<string, unknown>) =>
  body.data && typeof body.data === "object"
    ? (body.data as Record<string, unknown>)
    : null;

const getBodyPayments = (bodyData: Record<string, unknown> | null) => {
  const transactions =
    bodyData?.transactions && typeof bodyData.transactions === "object"
      ? (bodyData.transactions as Record<string, unknown>)
      : null;

  const payments = transactions?.payments;

  return Array.isArray(payments)
    ? (payments as Array<Record<string, unknown>>)
    : [];
};

const processEmbeddedOrderNotification = async (input: NotificationInput) => {
  const bodyData = getBodyData(input.body);
  const payments = getBodyPayments(bodyData);
  const payment = payments[0];
  const action =
    typeof input.body.action === "string" ? input.body.action : null;
  const orderId =
    (typeof bodyData?.id === "string" || typeof bodyData?.id === "number"
      ? String(bodyData.id)
      : null) ??
    (typeof input.query["data.id"] === "string"
      ? String(input.query["data.id"])
      : null);

  if (!orderId || !bodyData) {
    return null;
  }

  return upsertPaymentStatus({
    orderId,
    paymentId:
      typeof payment?.id === "string" || typeof payment?.id === "number"
        ? String(payment.id)
        : null,
    externalReference:
      typeof bodyData.external_reference === "string"
        ? bodyData.external_reference
        : null,
    amount:
      payment?.paid_amount ??
      payment?.amount ??
      (typeof bodyData.total_paid_amount === "string" ||
      typeof bodyData.total_paid_amount === "number"
        ? bodyData.total_paid_amount
        : null),
    status:
      typeof payment?.status === "string"
        ? payment.status
        : typeof bodyData.status === "string"
          ? bodyData.status
          : null,
    statusDetail:
      typeof payment?.status_detail === "string"
        ? payment.status_detail
        : typeof bodyData.status_detail === "string"
          ? bodyData.status_detail
          : null,
    paidAt:
      typeof input.body.date_created === "string"
        ? input.body.date_created
        : null,
    action,
  });
};

export const getPaymentAccessStatus = async (accessToken: string) => {
  const session = await PaymentSessionModel.findOne({ accessToken }).lean();

  if (!session) {
    return null;
  }

  return {
    authorized: session.attendanceUnlocked,
    status: session.status,
    statusDetail: session.statusDetail,
    amount: session.amount,
    paidAt: session.paidAt,
    rsvpSubmittedAt: session.rsvpSubmittedAt,
  };
};

export const markRsvpAsUsed = async (accessToken: string) =>
  PaymentSessionModel.findOneAndUpdate(
    { accessToken, attendanceUnlocked: true, rsvpSubmittedAt: null },
    { $set: { rsvpSubmittedAt: new Date() } },
    { new: true },
  );

export const processMercadoPagoWebhook = async (input: {
  body: Record<string, unknown>;
  query: Record<string, unknown>;
  headers?: Record<string, unknown>;
}) => {
  const embeddedNotificationResult =
    await processEmbeddedOrderNotification(input);

  if (embeddedNotificationResult) {
    return embeddedNotificationResult;
  }

  const details = extractNotificationDetails(input);

  if (details.orderId) {
    const order = await fetchMercadoPagoOrder(details.orderId);
    const payment = order.transactions?.payments?.[0];

    return upsertPaymentStatus({
      orderId: String(order.id ?? details.orderId),
      paymentId: payment?.id ? String(payment.id) : null,
      externalReference: order.external_reference ?? null,
      amount: payment?.amount ?? order.total_amount ?? null,
      status: payment?.status ?? order.status ?? "pending",
      statusDetail: payment?.status_detail ?? order.status_detail ?? "",
      paidAt:
        payment?.paid_at ??
        payment?.date_approved ??
        payment?.date_created ??
        null,
      action: details.type,
    });
  }

  if (details.paymentId) {
    const payment = await fetchMercadoPagoPayment(details.paymentId);

    return upsertPaymentStatus({
      paymentId: String(payment.id ?? details.paymentId),
      externalReference: payment.external_reference ?? null,
      amount: payment.transaction_amount ?? null,
      status: payment.status ?? "pending",
      statusDetail: payment.status_detail ?? "",
      paidAt: payment.date_approved ?? payment.date_created ?? null,
      action: details.type,
    });
  }

  return null;
};
