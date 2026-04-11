import type {
  EventContent,
  GiftItem,
  PaymentAccessStatus,
  PixPaymentPayload,
  PixPaymentResponse,
  RsvpItem,
  RsvpPayload,
} from "@/types/api";

const configuredApiBaseUrl = import.meta.env.VITE_API_URL?.trim();

const normalizeApiBaseUrl = (value: string) => value.replace(/\/$/, "");

const resolveApiBaseUrl = () => {
  if (!configuredApiBaseUrl) {
    return "/api";
  }

  if (configuredApiBaseUrl.startsWith("/")) {
    return normalizeApiBaseUrl(configuredApiBaseUrl);
  }

  if (typeof window === "undefined") {
    return normalizeApiBaseUrl(configuredApiBaseUrl);
  }

  try {
    const apiUrl = new URL(configuredApiBaseUrl);
    const isLoopbackTarget = ["localhost", "127.0.0.1", "::1"].includes(apiUrl.hostname);
    const isLocalApp = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

    if (isLoopbackTarget && !isLocalApp) {
      return "/api";
    }

    return normalizeApiBaseUrl(configuredApiBaseUrl);
  } catch {
    return "/api";
  }
};

const apiBaseUrl = resolveApiBaseUrl();

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

export const getRsvps = () => request<RsvpItem[]>("/rsvps");

export const createPixPayment = (payload: PixPaymentPayload) =>
  request<PixPaymentResponse>("/payments/pix", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getPaymentAccessStatus = (accessToken: string) =>
  request<PaymentAccessStatus>(`/payments/access/${accessToken}`);
