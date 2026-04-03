import { randomUUID } from "node:crypto";
import { Router } from "express";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { z } from "zod";
import { env } from "../config/env.js";

const paymentClient = new Payment(
  new MercadoPagoConfig({
    accessToken: env.MERCADO_PAGO_ACCESS_TOKEN,
  })
);

const createPixPaymentSchema = z.object({
  transactionAmount: z.coerce.number().positive("Valor invalido."),
  description: z.string().trim().min(1, "Descricao obrigatoria."),
  payer: z.object({
    email: z.string().email("Informe um e-mail valido."),
    firstName: z.string().trim().min(1, "Informe o nome."),
    lastName: z.string().trim().min(1, "Informe o sobrenome."),
    identificationType: z.literal("CPF"),
    identificationNumber: z.string().trim().min(11).max(11),
  }),
});

export const paymentRouter = Router();

paymentRouter.post("/pix", async (req, res) => {
  const parsed = createPixPaymentSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: parsed.error.issues[0]?.message ?? "Dados invalidos.",
    });
  }

  try {
    const payment = await paymentClient.create({
      body: {
        transaction_amount: parsed.data.transactionAmount,
        description: parsed.data.description,
        payment_method_id: "pix",
        payer: {
          email: parsed.data.payer.email,
          first_name: parsed.data.payer.firstName,
          last_name: parsed.data.payer.lastName,
          identification: {
            type: parsed.data.payer.identificationType,
            number: parsed.data.payer.identificationNumber,
          },
        },
        ...(env.PIX_NOTIFICATION_URL
          ? { notification_url: env.PIX_NOTIFICATION_URL }
          : {}),
      },
      requestOptions: {
        idempotencyKey: randomUUID(),
      },
    });

    const transactionData = payment.point_of_interaction?.transaction_data;

    if (
      !transactionData?.qr_code ||
      !transactionData.qr_code_base64 ||
      !transactionData.ticket_url
    ) {
      return res.status(502).json({
        message: "Mercado Pago nao retornou os dados do Pix.",
      });
    }

    return res.status(201).json({
      id: String(payment.id),
      status: payment.status,
      statusDetail: payment.status_detail,
      qrCode: transactionData.qr_code,
      qrCodeBase64: transactionData.qr_code_base64,
      ticketUrl: transactionData.ticket_url,
    });
  } catch (error) {
    console.error("Erro ao gerar Pix no Mercado Pago", error);

    return res.status(502).json({
      message: "Nao foi possivel gerar o Pix no Mercado Pago.",
    });
  }
});
