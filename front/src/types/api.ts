export interface EventContent {
  id: string;
  navTitle: string;
  eventTitle: string;
  eventSubtitle: string;
  giftSectionTitle: string;
  giftSectionDescription: string;
  rsvpTitle: string;
  rsvpDescription: string;
  footerText: string;
  supportPhone: string;
}

export interface GiftItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface RsvpPayload {
  name: string;
  guests: number;
}

export interface PixPaymentPayload {
  giftId: string;
}

export interface PixPaymentResponse {
  id: string;
  externalReference: string;
  idempotencyKey: string;
  status: string;
  statusDetail: string;
  totalAmount: string;
  qrMode: "static" | "dynamic" | "hybrid";
  qrData: string | null;
  usesStaticPosQr: boolean;
  staticQrConfigured: boolean;
  instructions: string;
  ticketUrl: string | null;
  payment: {
    id: string;
    amount: string;
    status: string;
    statusDetail: string;
  };
  store: {
    id: number;
    externalStoreId: string;
    externalPosId: string;
    posExternalId: string;
    storeExternalId: string;
    name: string;
  };
}
