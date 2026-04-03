import type {
  EventContent,
  GiftItem,
  PixPaymentPayload,
  PixPaymentResponse,
  RsvpPayload,
} from "@/types/api";

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "/api";

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;

    throw new Error(error?.message ?? "Nao foi possivel concluir a requisicao.");
  }

  return response.json() as Promise<T>;
};

export const getEventContent = () => request<EventContent>("/event");

export const getGiftItems = () => request<GiftItem[]>("/gifts");

export const createRsvp = (payload: RsvpPayload) =>
  request<{ message: string }>("/rsvps", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const createPixPayment = (payload: PixPaymentPayload) =>
  request<PixPaymentResponse>("/payments/pix", {
    method: "POST",
    body: JSON.stringify(payload),
  });
