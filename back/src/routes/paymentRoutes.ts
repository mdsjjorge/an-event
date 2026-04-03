import axios from "axios";
import { randomUUID } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import { GiftModel } from "../models/Gift.js";
import {
  buildProjectIdempotencyKey,
  formatAmountString,
} from "../lib/mercadoPago.js";

const createPixOrderSchema = z.object({
  giftId: z.string().trim().min(1, "giftId e obrigatorio."),
});

export const paymentRouter = Router();

paymentRouter.post("/pix", async (req, res) => {
  const parsed = createPixOrderSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  const gift = await GiftModel.findById(parsed.data.giftId).lean();

  if (!gift || !gift.active) {
    return res.status(404).json({
      message: "Presente nao encontrado.",
    });
  }

  const amount = formatAmountString(gift.price);
  const description = gift.name.trim().slice(0, 150);
  const externalReference = `an-event-gift-${gift._id}-${Date.now()}`;
  const idempotencyKey = buildProjectIdempotencyKey({
    operation: "create-pix-order",
    giftId: String(gift._id),
    amount,
    reference: externalReference,
  });

  const orderPayload = {
    type: "qr",
    total_amount: amount,
    description,
    external_reference: externalReference,
    config: {
      qr: {
        external_pos_id: env.MP_POS_EXTERNAL_ID,
        mode: env.MP_QR_MODE,
      },
    },
    transactions: {
      payments: [
        {
          amount,
        },
      ],
    },
    items: [
      {
        title: description,
        unit_price: amount,
        quantity: 1,
        unit_measure: "unit",
        external_code: String(gift._id),
      },
    ],
  };

  const headers = {
    Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
    "X-Idempotency-Key": idempotencyKey,
  };

  // console.log("🚀 ~ ~ orderPayload:", JSON.stringify(orderPayload, null, 2));
  // console.log("🚀 ~ ~ headers:", JSON.stringify(headers, null, 2));

  try {
    const response = await axios.post(
      "https://api.mercadopago.com/v1/orders",
      orderPayload,
      {
        headers,
        validateStatus: () => true,
      },
    );

    const data = (response.data ?? null) as Record<string, unknown> | null;

    if (response.status < 200 || response.status >= 300) {
      console.error("Mercado Pago order error", {
        status: response.status,
        idempotencyKey,
        orderPayload,
        data,
      });

      return res.status(502).json({
        message: "Nao foi possivel criar a order Pix no Mercado Pago.",
        mercadoPagoStatus: response.status,
        mercadoPagoError: data,
        mercadoPagoPayload: orderPayload,
        idempotencyKey,
      });
    }

    const qrData = (data?.type_response as { qr_data?: string } | undefined)
      ?.qr_data;
    const payments = (
      data?.transactions as
        | { payments?: Array<Record<string, unknown>> }
        | undefined
    )?.payments;
    const payment = payments?.[0];
    const isStaticMode = env.MP_QR_MODE === "static";

    if (!payment) {
      return res.status(502).json({
        message: "Mercado Pago nao retornou os dados esperados da order Pix.",
      });
    }

    if (!isStaticMode && !qrData) {
      return res.status(502).json({
        message: "Mercado Pago nao retornou qr_data para o modo configurado.",
      });
    }

    return res.status(201).json({
      id: String(data?.id ?? randomUUID()),
      externalReference,
      idempotencyKey,
      status: String(data?.status ?? ""),
      statusDetail: String(data?.status_detail ?? ""),
      totalAmount: String(data?.total_amount ?? amount),
      qrMode: env.MP_QR_MODE,
      qrData: qrData ?? env.MP_STATIC_QR_DATA ?? null,
      usesStaticPosQr: isStaticMode,
      staticQrConfigured: Boolean(env.MP_STATIC_QR_DATA),
      instructions: isStaticMode
        ? "Modo static: o QR exibido deve ser o QR do caixa criado previamente no Mercado Pago."
        : "Modo dynamic/hybrid: use o qr_data retornado pela order.",
      ticketUrl: null,
      payment: {
        id: String(payment.id ?? ""),
        amount: String(payment.amount ?? amount),
        status: String(payment.status ?? ""),
        statusDetail: String(payment.status_detail ?? ""),
      },
      store: {
        id: env.MP_STORE_ID,
        externalStoreId: env.MP_STORE_EXTERNAL_ID,
        externalPosId: env.MP_POS_EXTERNAL_ID,
        posExternalId: env.MP_POS_EXTERNAL_ID,
        storeExternalId: env.MP_STORE_EXTERNAL_ID,
        name: env.MP_STORE_NAME,
      },
    });
  } catch (error) {
    console.error("Erro ao criar order Pix no Mercado Pago", error);

    return res.status(502).json({
      message: "Falha de comunicacao com o Mercado Pago.",
    });
  }
});
